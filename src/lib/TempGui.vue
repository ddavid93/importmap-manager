<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Import Map Overrides Manager</h1>

    <!-- Tab Navigation -->
    <div class="border-b mb-4">
      <nav class="flex space-x-4" role="tablist">
        <button
          :class="activeTab === 'imports' ? activeTabClass : inactiveTabClass"
          @click="activeTab = 'imports'"
          role="tab">
          <!-- Import Icon -->
          <svg class="inline w-5 h-5 mr-1" fill="none" stroke="currentColor" stroke-width="2"
               viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path>
          </svg>
          Imports
        </button>
        <button
          :class="activeTab === 'scopes' ? activeTabClass : inactiveTabClass"
          @click="activeTab = 'scopes'"
          role="tab">
          <!-- Scope Icon -->
          <svg class="inline w-5 h-5 mr-1" fill="none" stroke="currentColor" stroke-width="2"
               viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
          Scopes
        </button>
        <button
          :class="activeTab === 'externals' ? activeTabClass : inactiveTabClass"
          @click="activeTab = 'externals'"
          role="tab">
          <!-- External Icon -->
          <svg class="inline w-5 h-5 mr-1" fill="none" stroke="currentColor" stroke-width="2"
               viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 20h9"></path>
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z"></path>
          </svg>
          Externals
        </button>
        <button
          :class="activeTab === 'presets' ? activeTabClass : inactiveTabClass"
          @click="activeTab = 'presets'"
          role="tab">
          <!-- Preset Icon -->
          <svg class="inline w-5 h-5 mr-1" fill="none" stroke="currentColor" stroke-width="2"
               viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v4a1 1 0 001 1h3m10 0h3a1 1 0 001-1V7m-4 10H7a1 1 0 01-1-1V7m6 10v4"></path>
          </svg>
          Presets
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <transition name="fade" mode="out-in">
      <div v-if="activeTab === 'imports'" key="imports">
        <!-- Import Overrides Section -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">Import Overrides</h2>
          <form @submit.prevent="addImportOverride" class="flex flex-col space-y-4">
            <div class="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
              <div class="flex-1">
                <label class="block text-sm font-medium">Module Name</label>
                <input
                  v-model="newOverride.moduleName"
                  type="text"
                  list="presetModules"
                  placeholder="e.g. react"
                  class="mt-1 block w-full border p-2 rounded"
                  required
                />
                <!-- Datalist for autocomplete based on presets -->
                <datalist id="presetModules">
                  <option v-for="preset in presets" :key="preset.name" :value="preset.name" />
                </datalist>
              </div>
              <div class="flex-1">
                <label class="block text-sm font-medium">URL or Port</label>
                <input
                  v-model="newOverride.url"
                  type="text"
                  placeholder="e.g. https://cdn.com/react.js or 3000"
                  class="mt-1 block w-full border p-2 rounded"
                  required
                />
              </div>
              <div class="flex items-end">
                <button type="submit"
                        :disabled="!newOverride.moduleName || !newOverride.url"
                        class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded flex items-center disabled:opacity-50">
                  <!-- Plus Icon -->
                  <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" stroke-width="2"
                       viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Add
                </button>
              </div>
            </div>
          </form>
          <div class="mt-4 overflow-x-auto">
            <table class="min-w-full border">
              <thead class="bg-gray-200">
              <tr>
                <th class="p-2 border">Module</th>
                <th class="p-2 border">URL</th>
                <th class="p-2 border">Action</th>
              </tr>
              </thead>
              <tbody>
              <tr
                v-for="(url, moduleName) in importOverrides"
                :key="moduleName"
                class="border-b hover:bg-gray-50 transition-colors"
              >
                <td class="p-2 border">{{ moduleName }}</td>
                <td class="p-2 border">{{ url }}</td>
                <td class="p-2 border">
                  <button
                    @click="confirmDeletion({ type: 'import', moduleName })"
                    class="bg-red-500 hover:bg-red-600 text-white p-1 rounded inline-flex items-center"
                  >
                    <!-- Trash Icon -->
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"
                         viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a1 1 0 011 1v2H9V4a1 1 0 011-1z"></path>
                    </svg>
                    <span class="sr-only">Delete</span>
                  </button>
                </td>
              </tr>
              <tr v-if="Object.keys(importOverrides).length === 0">
                <td colspan="3" class="p-2 text-center">No import overrides set.</td>
              </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div v-else-if="activeTab === 'scopes'" key="scopes">
        <!-- Scope Overrides Section -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">Scope Overrides</h2>
          <form @submit.prevent="addScopeOverride" class="flex flex-col space-y-4">
            <div class="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
              <div class="flex-1">
                <label class="block text-sm font-medium">Scope</label>
                <input
                  v-model="newScopeOverride.scope"
                  type="text"
                  placeholder="e.g. /my/scope/"
                  class="mt-1 block w-full border p-2 rounded"
                  required
                />
              </div>
              <div class="flex-1">
                <label class="block text-sm font-medium">Module Name</label>
                <input
                  v-model="newScopeOverride.moduleName"
                  type="text"
                  list="presetModules"
                  placeholder="e.g. react"
                  class="mt-1 block w-full border p-2 rounded"
                  required
                />
              </div>
              <div class="flex-1">
                <label class="block text-sm font-medium">URL</label>
                <input
                  v-model="newScopeOverride.url"
                  type="text"
                  placeholder="e.g. https://cdn.com/react.production.js"
                  class="mt-1 block w-full border p-2 rounded"
                  required
                />
              </div>
              <div class="flex items-end">
                <button type="submit"
                        :disabled="!newScopeOverride.scope || !newScopeOverride.moduleName || !newScopeOverride.url"
                        class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded flex items-center disabled:opacity-50">
                  <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" stroke-width="2"
                       viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Add
                </button>
              </div>
            </div>
          </form>
          <div class="mt-4 overflow-x-auto">
            <table class="min-w-full border">
              <thead class="bg-gray-200">
              <tr>
                <th class="p-2 border">Scope</th>
                <th class="p-2 border">Module</th>
                <th class="p-2 border">URL</th>
                <th class="p-2 border">Action</th>
              </tr>
              </thead>
              <tbody>
              <template v-for="(modules, scope) in scopeOverrides" :key="scope">
                <tr v-for="(url, moduleName, index) in modules" :key="moduleName" class="border-b hover:bg-gray-50 transition-colors">
                  <td class="p-2 border" v-if="index === 0" :rowspan="Object.keys(modules).length">
                    {{ scope }}
                  </td>
                  <td class="p-2 border">{{ moduleName }}</td>
                  <td class="p-2 border">{{ url }}</td>
                  <td class="p-2 border">
                    <button
                      @click="confirmDeletion({ type: 'scope', scope, moduleName })"
                      class="bg-red-500 hover:bg-red-600 text-white p-1 rounded inline-flex items-center"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"
                           viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a1 1 0 011 1v2H9V4a1 1 0 011-1z"></path>
                      </svg>
                      <span class="sr-only">Delete</span>
                    </button>
                  </td>
                </tr>
              </template>
              <tr v-if="Object.keys(scopeOverrides).length === 0">
                <td colspan="4" class="p-2 text-center">No scope overrides set.</td>
              </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div v-else-if="activeTab === 'externals'" key="externals">
        <!-- External Override Maps Section -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">External Override Maps</h2>
          <form @submit.prevent="addExternalOverride" class="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
            <div class="flex-1">
              <label class="block text-sm font-medium">External URL</label>
              <input
                v-model="newExternalOverride"
                type="text"
                placeholder="e.g. https://example.com/override-map.json"
                class="mt-1 block w-full border p-2 rounded"
                required
              />
            </div>
            <div class="flex items-end">
              <button type="submit"
                      :disabled="!newExternalOverride"
                      class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded flex items-center disabled:opacity-50">
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" stroke-width="2"
                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path>
                </svg>
                Add
              </button>
            </div>
          </form>
          <ul class="list-disc pl-6 mt-4">
            <li v-for="url in externalOverrides" :key="url" class="flex items-center justify-between hover:bg-gray-50 p-2 rounded transition-colors">
              <span>{{ url }}</span>
              <button
                @click="confirmDeletion({ type: 'external', url })"
                class="bg-red-500 hover:bg-red-600 text-white p-1 rounded inline-flex items-center"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"
                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a1 1 0 011 1v2H9V4a1 1 0 011-1z"></path>
                </svg>
                <span class="sr-only">Delete</span>
              </button>
            </li>
            <li v-if="externalOverrides.length === 0" class="text-center py-2">No external overrides set.</li>
          </ul>
        </section>
      </div>

      <div v-else-if="activeTab === 'presets'" key="presets">
        <!-- Preset Libraries Section -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">Preset Library Templates</h2>
          <p class="mb-4 text-gray-600">Click on a preset to add its override automatically.</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              v-for="preset in presets" :key="preset.name"
              class="border rounded p-4 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <h3 class="text-lg font-bold flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2"
                       viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path>
                  </svg>
                  {{ preset.name }}
                </h3>
                <p class="text-sm text-gray-500 mt-1 break-all">{{ preset.url }}</p>
              </div>
              <button @click="addPresetOverride(preset)" class="mt-4 bg-green-500 hover:bg-green-600 text-white p-2 rounded inline-flex items-center justify-center">
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" stroke-width="2"
                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path>
                </svg>
                Add Override
              </button>
            </div>
          </div>
        </section>
      </div>
    </transition>

    <!-- Global Reset Button -->
    <div class="mt-8 flex justify-end">
      <button @click="openResetModal" class="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded inline-flex items-center">
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" stroke-width="2"
             viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
        Reset All Overrides
      </button>
    </div>

    <!-- Confirmation Modal -->
    <transition name="fade">
      <div v-if="confirmModal.show" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div class="bg-white rounded p-6 max-w-sm w-full">
          <h2 class="text-xl font-bold mb-4">Confirm Deletion</h2>
          <p class="mb-4">
            Are you sure you want to delete
            <span v-if="confirmModal.type === 'import'">
              the override for <strong>{{ confirmModal.details.moduleName }}</strong>?
            </span>
            <span v-else-if="confirmModal.type === 'scope'">
              the override for <strong>{{ confirmModal.details.moduleName }}</strong> in scope <strong>{{ confirmModal.details.scope }}</strong>?
            </span>
            <span v-else-if="confirmModal.type === 'external'">
              the external override <strong>{{ confirmModal.details.url }}</strong>?
            </span>
          </p>
          <div class="flex justify-end space-x-2">
            <button @click="closeConfirmModal" class="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded">
              Cancel
            </button>
            <button @click="confirmDeletionAction" class="bg-red-500 hover:bg-red-600 text-white p-2 rounded">
              Delete
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import importMapOverrides from './newOneToSplit.ts';

interface ImportOverrides {
  [moduleName: string]: string;
}

interface ScopeOverrides {
  [scope: string]: {
    [moduleName: string]: string;
  };
}

type DeletionType = 'import' | 'scope' | 'external';

interface ConfirmDetails {
  type: DeletionType;
  // For import removal: moduleName
  // For scope removal: scope and moduleName
  // For external: url
  moduleName?: string;
  scope?: string;
  url?: string;
}

interface ConfirmModalState {
  show: boolean;
  details: ConfirmDetails;
}

// Tabs
const activeTab = ref<'imports' | 'scopes' | 'externals' | 'presets'>('imports');
const activeTabClass = 'py-2 px-4 border-b-2 border-blue-500 text-blue-500 focus:outline-none';
const inactiveTabClass = 'py-2 px-4 text-gray-600 hover:text-blue-500 focus:outline-none';

// Reactive state for overrides
const importOverrides = reactive<ImportOverrides>({});
const scopeOverrides = reactive<ScopeOverrides>({});
const externalOverrides = ref<string[]>([]);

// Form models for new entries
const newOverride = reactive({
  moduleName: '',
  url: '',
});
const newScopeOverride = reactive({
  scope: '',
  moduleName: '',
  url: '',
});
const newExternalOverride = ref('');

// Preset library templates
const presets = ref([
  { name: 'React', url: 'https://unpkg.com/react/umd/react.development.js' },
  { name: 'React DOM', url: 'https://unpkg.com/react-dom/umd/react-dom.development.js' },
  { name: 'Vue', url: 'https://unpkg.com/vue/dist/vue.global.js' },
  { name: 'Angular', url: 'https://unpkg.com/@angular/core/bundles/core.umd.js' },
  { name: 'Lodash', url: 'https://unpkg.com/lodash/lodash.js' },
]);

// Modal state for deletion confirmation
const confirmModal = reactive<ConfirmModalState>({
  show: false,
  details: { type: 'import' },
});

// Function to load current overrides from the API
function loadOverrides() {
  const map = importMapOverrides.getOverrideMap();
  // Load import overrides
  Object.keys(map.imports).forEach((moduleName) => {
    importOverrides[moduleName] = map.imports[moduleName];
  });
  // Clear and load scope overrides
  for (const key in scopeOverrides) {
    delete scopeOverrides[key];
  }
  Object.keys(map.scopes).forEach((scope) => {
    scopeOverrides[scope] = { ...map.scopes[scope] };
  });
  externalOverrides.value = importMapOverrides.getExternalOverrides();
}

// Refresh all overrides in the UI
function refreshOverrides() {
  for (const key in importOverrides) delete importOverrides[key];
  for (const key in scopeOverrides) delete scopeOverrides[key];
  loadOverrides();
}

// Add Import Override with form validation
function addImportOverride() {
  if (newOverride.moduleName.trim() && newOverride.url.trim()) {
    importMapOverrides.addOverride(newOverride.moduleName.trim(), newOverride.url.trim());
    newOverride.moduleName = '';
    newOverride.url = '';
    refreshOverrides();
  }
}

// Add Scope Override
function addScopeOverride() {
  if (newScopeOverride.scope.trim() && newScopeOverride.moduleName.trim() && newScopeOverride.url.trim()) {
    importMapOverrides.addScopeOverride(
      newScopeOverride.scope.trim(),
      newScopeOverride.moduleName.trim(),
      newScopeOverride.url.trim()
    );
    newScopeOverride.scope = '';
    newScopeOverride.moduleName = '';
    newScopeOverride.url = '';
    refreshOverrides();
  }
}

// Add External Override
function addExternalOverride() {
  if (newExternalOverride.value.trim()) {
    importMapOverrides.addExternalOverride(newExternalOverride.value.trim());
    newExternalOverride.value = '';
    refreshOverrides();
  }
}

// Add Preset Override directly as an import override
function addPresetOverride(preset: { name: string; url: string }) {
  importMapOverrides.addOverride(preset.name, preset.url);
  refreshOverrides();
}

// Set up deletion confirmation modal for remove actions
function confirmDeletion(details: ConfirmDetails) {
  confirmModal.details = details;
  confirmModal.show = true;
}

// Called when user confirms deletion from modal
function confirmDeletionAction() {
  const details = confirmModal.details;
  if (details.type === 'import' && details.moduleName) {
    importMapOverrides.removeOverride(details.moduleName);
  } else if (details.type === 'scope' && details.moduleName && details.scope) {
    importMapOverrides.removeScopeOverride(details.scope, details.moduleName);
  } else if (details.type === 'external' && details.url) {
    importMapOverrides.removeExternalOverride(details.url);
  }
  closeConfirmModal();
  refreshOverrides();
}

// Close deletion confirmation modal
function closeConfirmModal() {
  confirmModal.show = false;
}

// Load overrides on mount
onMounted(() => {
  loadOverrides();
});
</script>

<style scoped>
/* Fade transition for modals and tab content */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
