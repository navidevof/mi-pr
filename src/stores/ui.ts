import { defineStore } from "pinia";
import { ref } from "vue";

export const useUIStore = defineStore("ui", () => {
	const isLoading = ref<boolean>(false);

	function setState(state: boolean) {
		isLoading.value = state;
	}

	return { isLoading, setState };
});
