<template>
  <q-page
    class="text-white flex flex-col gap-8 items-center justify-center w-full p-8"
  >
    <q-card class="rounded-xl border-l-2 border-primary bg-secondary w-[650px]">
      <q-card-section class="flex flex-col gap-4 items-center w-full">
        <span class="text-lg">GitHub API</span>
        <q-form
          class="flex flex-nowrap gap-4 items-center w-full"
          @submit="getRepos"
        >
          <q-input
            class="grow"
            v-model="form.user"
            color="accent"
            dark
            outlined
            placeholder="Repo..."
          />
          <q-btn type="submit" label="Get Repositories" color="accent" push />
        </q-form>
      </q-card-section>
    </q-card>

    <q-list class="flex flex-col gap-2 w-full">
      <q-item
        class="bg-secondary rounded-xl"
        v-for="(repo, idx) in lstRepos"
        :key="idx"
      >
        <q-item-section class="flex flex-col gap-2">
          <q-item-label class="text-h6">
            {{ repo.name }}
          </q-item-label>
          <q-item-label caption>
            {{ repo.description }}
          </q-item-label>

          <q-table
            v-if="repo.commits"
            :rows="repo.commits"
            :columns="commitColumns"
            row-key="sha"
            flat
            dense
            class="q-mt-sm"
            :pagination="{ rowsPerPage: 5 }"
            wrap-cells
          >
            <template #body-cell-message="props">
              <q-td :props="props">
                {{ props.row.commit.message }}
              </q-td>
            </template>

            <template #body-cell-author="props">
              <q-td :props="props">
                {{ props.row.commit.author.name }}
              </q-td>
            </template>

            <template #body-cell-date="props">
              <q-td :props="props">
                {{
                  new Date(props.row.commit.author.date).toLocaleDateString()
                }}
              </q-td>
            </template>
          </q-table>
        </q-item-section>

        <q-item-section side>
          <q-btn
            label="ver commits"
            push
            color="positive"
            @click="() => getCommits(repo.name)"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { getUserRepo, getRepoCommits } from "src/services/GithubService";
import { ref } from "vue";

const commitColumns = [
  {
    name: "message",
    label: "Mensagem",
    field: (row) => row.commit.message,
    align: "left",
    sortable: true,
  },
  {
    name: "author",
    label: "Autor",
    field: (row) => row.commit.author.name,
    align: "left",
    sortable: true,
  },
  {
    name: "date",
    label: "Data",
    field: (row) => row.commit.author.date,
    align: "left",
    sortable: true,
  },
];

const $q = useQuasar();

const form = ref({
  user: "",
});

const lstRepos = ref([]);

const getRepos = async () => {
  if (!form.value.user) {
    $q.notify({
      color: "negative",
      message: "Please enter a user",
      icon: "error",
    });
    return;
  }
  $q.loading.show({
    message: "Loading repositories...",
    spinnerColor: "white",
  });
  try {
    const { data } = await getUserRepo(form.value.user);
    lstRepos.value = data;
  } catch (error) {
    $q.notify({
      color: "negative",
      message: error.message || "Error fetching user repo",
      icon: "error",
    });
    console.error("Error fetching user repo:", error);
  } finally {
    $q.loading.hide();
  }
};

const getCommits = async (repoName) => {
  $q.loading.show({
    message: "Loading commits...",
    spinnerColor: "white",
  });
  try {
    const { data } = await getRepoCommits(form.value.user, repoName);
    lstRepos.value.forEach((repo) => {
      if (repo.name === repoName) {
        console.log("🚀 ~ entrei", data);
        repo.commits = data;
      }
    });
    console.log(
      "🚀 ~ lstRepos.value.forEach ~ lstRepos.value:",
      lstRepos.value
    );
  } catch (error) {
    $q.notify({
      color: "negative",
      message: error.message || "Error fetching commits",
      icon: "error",
    });
  } finally {
    $q.loading.hide();
  }
};
</script>
