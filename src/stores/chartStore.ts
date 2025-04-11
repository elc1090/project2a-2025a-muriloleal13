import { defineStore } from "pinia";

const defaultData = [];

export const getChartStorage = () => {
  const chartString = localStorage.getItem("nuuvem-chart");

  if (!chartString) {
    return defaultData;
  }

  try {
    return JSON.parse(chartString);
  } catch (error) {
    console.error("Erro ao parsear nuuvem-chart do localStorage:", error);
    return defaultData;
  }
};

export const useChartStore = defineStore("nuuvem-chart", {
  state: () => ({ chartData: getChartStorage() }),
  getters: {
    storeChartDataGetter(state) {
      return state.chartData;
    },
  },
  actions: {
    storageChartSave(chart) {
      this.chartData = chart;
      localStorage.setItem("nuuvem-chart", JSON.stringify(this.chartData));
    },
    storageChartRemove() {
      this.chartData = defaultData;
      localStorage.removeItem("nuuvem-chart");
    },
  },
});
