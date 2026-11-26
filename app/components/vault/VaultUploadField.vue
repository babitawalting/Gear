<!-- app/components/vault/VaultUploadField.vue
     The dashed box on the "Nieuw document" page: tapping it opens the file picker of the phone or computer.
     After choosing, the box shows the name of the file. Tapping it again chooses another file.
     The file itself is not uploaded yet (there is no server), the parent only gets the file name.
     Usage: <VaultUploadField v-model="fileName" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // The name of the chosen file, for example "cv.pdf". With v-model the parent passes this in as `modelValue`.
    // Empty means no file is chosen yet
    modelValue: { type: String, default: "" },
    // True while the box can't be used yet (for example in a locked step of a plan): it turns grey and stays visible
    isDisabled: { type: Boolean, default: false },
    // True for a smaller box (80px high with a smaller icon), for example inside the step of a plan
    small: { type: Boolean, default: false },
  },
  // Tells the parent which file was chosen (this makes v-model work)
  emits: ["update:modelValue"],
  computed: {
    hasFile(): boolean {
      return this.modelValue !== "";
    },
  },
  methods: {
    // Runs when the user picked a file. input.files is the list of chosen files, we only use the first one
    handleChange(event: Event) {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      if (file) {
        this.$emit("update:modelValue", file.name);
      }
    },
  },
});
</script>

<template>
  <!-- The <label> wraps the hidden file input, so tapping anywhere in the box opens the file picker.
       focus-within shows the focus outline on the box when the hidden input has keyboard focus -->
  <label
    class="relative flex w-full flex-col items-center justify-center rounded-xl border border-dashed bg-white px-4 text-center focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue"
    :class="[isDisabled ? 'border-grey' : 'border-blue', small ? 'h-20 gap-1' : 'h-34 gap-4']"
  >
    <!-- A real file input, so the keyboard and screen readers just work. sr-only hides it, the box is what the user sees -->
    <input type="file" class="sr-only" :disabled="isDisabled" @change="handleChange">
    <IconDisplay
      :name="hasFile ? 'file-lines' : 'arrow-up-from-bracket'"
      :class="[small ? 'size-6' : 'size-12', isDisabled ? 'text-grey' : 'text-blue']"
    />
    <span v-if="hasFile" class="flex min-w-0 max-w-full flex-col">
      <span class="truncate text-sm leading-5 font-semibold text-navy">{{ modelValue }}</span>
      <span class="text-xs leading-4 font-normal text-grey">Tik om een ander bestand te kiezen</span>
    </span>
    <span v-else class="text-sm leading-5 font-normal text-grey">Upload een bestand</span>
  </label>
</template>
