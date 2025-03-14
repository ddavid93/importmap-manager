<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Import Map Overrides Manager</h1>

    <!-- Tabs using shadcn-vue components -->
    <Tabs v-model="activeTab">
      <TabsList class="mb-4">
        <TabsTrigger value="imports">
          <PlusIcon class="w-4 h-4 mr-2" />
          Imports
        </TabsTrigger>
        <TabsTrigger value="scopes">
          <MenuIcon class="w-4 h-4 mr-2" />
          Scopes
        </TabsTrigger>
        <TabsTrigger value="externals">
          <ExternalLinkIcon class="w-4 h-4 mr-2" />
          Externals
        </TabsTrigger>
        <TabsTrigger value="presets">
          <LibraryIcon class="w-4 h-4 mr-2" />
          Presets
        </TabsTrigger>
      </TabsList>

      <!-- Imports Tab Content -->
      <TabsContent value="imports">
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">Import Overrides</h2>
          <form @submit.prevent="addImportOverride" class="flex flex-col space-y-4">
            <div class="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
              <div class="flex-1">
                <label class="block text-sm font-medium">Module Name</label>
                <Input
                  v-model="newOverride.moduleName"
                  type="text"
                  list="presetModules"
                  placeholder="e.g. react"
                  required
                />
                <!-- Autocomplete datalist based on presets -->
                <datalist id="presetModules">
                  <option v-for="preset in presets" :key="preset.name" :value="preset.name" />
                </datalist>
              </div>
              <div class="flex-1">
                <label class="block text-sm font-medium">URL or Port</label>
                <Input
                  v-model="newOverride.url"
                  type="text"
                  placeholder="e.g. https://cdn.com/react.js or 3000"
                  required
                />
              </div>
              <div class="flex items-end">
                <Button
                  type="submit"
                  variant="primary"
                  :disabled="!newOverride.moduleName || !newOverride.url"
                >
                  <PlusIcon class="w-4 h-4 mr-1" />
                  Add
                </Button>
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
                    <Button
                      variant="destructive"
                      size="sm"
                      @click="confirmDeletion({ type: 'import', moduleName })"
                    >
                      <Trash2Icon class="w-4 h-4" />
                      <span class="sr-only">Delete</span>
                    </Button>
                  </td>
                </tr>
                <tr v-if="Object.keys(importOverrides).length === 0">
                  <td colspan="3" class="p-2 text-center">No import overrides set.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </TabsContent>

      <!-- Scopes Tab Content -->
      <TabsContent value="scopes">
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">Scope Overrides</h2>
          <form @submit.prevent="addScopeOverride" class="flex flex-col space-y-4">
            <div class="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
              <div class="flex-1">
                <label class="block text-sm font-medium">Scope</label>
                <Input
                  v-model="newScopeOverride.scope"
                  type="text"
                  placeholder="e.g. /my/scope/"
                  required
                />
              </div>
              <div class="flex-1">
                <label class="block text-sm font-medium">Module Name</label>
                <Input
                  v-model="newScopeOverride.moduleName"
                  type="text"
                  list="presetModules"
                  placeholder="e.g. react"
                  required
                />
              </div>
              <div class="flex-1">
                <label class="block text-sm font-medium">URL</label>
                <Input
                  v-model="newScopeOverride.url"
                  type="text"
                  placeholder="e.g. https://cdn.com/react.production.js"
                  required
                />
              </div>
              <div class="flex items-end">
                <Button
                  type="submit"
                  variant="primary"
                  :disabled="
                    !newScopeOverride.scope || !newScopeOverride.moduleName || !newScopeOverride.url
                  "
                >
                  <PlusIcon class="w-4 h-4 mr-1" />
                  Add
                </Button>
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
                  <tr
                    v-for="(url, moduleName, index) in modules"
                    :key="moduleName"
                    class="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td
                      class="p-2 border"
                      v-if="index === 0"
                      :rowspan="Object.keys(modules).length"
                    >
                      {{ scope }}
                    </td>
                    <td class="p-2 border">{{ moduleName }}</td>
                    <td class="p-2 border">{{ url }}</td>
                    <td class="p-2 border">
                      <Button
                        variant="destructive"
                        size="sm"
                        @click="confirmDeletion({ type: 'scope', scope, moduleName })"
                      >
                        <Trash2Icon class="w-4 h-4" />
                        <span class="sr-only">Delete</span>
                      </Button>
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
      </TabsContent>

      <!-- Externals Tab Content -->
      <TabsContent value="externals">
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">External Override Maps</h2>
          <form
            @submit.prevent="addExternalOverride"
            class="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0"
          >
            <div class="flex-1">
              <label class="block text-sm font-medium">External URL</label>
              <Input
                v-model="newExternalOverride"
                type="text"
                placeholder="e.g. https://example.com/override-map.json"
                required
              />
            </div>
            <div class="flex items-end">
              <Button type="submit" variant="primary" :disabled="!newExternalOverride">
                <PlusIcon class="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </form>
          <ul class="list-disc pl-6 mt-4">
            <li
              v-for="url in externalOverrides"
              :key="url"
              class="flex items-center justify-between hover:bg-gray-50 p-2 rounded transition-colors"
            >
              <span>{{ url }}</span>
              <Button
                variant="destructive"
                size="sm"
                @click="confirmDeletion({ type: 'external', url })"
              >
                <Trash2Icon class="w-4 h-4" />
                <span class="sr-only">Delete</span>
              </Button>
            </li>
            <li v-if="externalOverrides.length === 0" class="text-center py-2">
              No external overrides set.
            </li>
          </ul>
        </section>
      </TabsContent>

      <!-- Presets Tab Content -->
      <TabsContent value="presets">
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">Preset Library Templates</h2>
          <p class="mb-4 text-gray-600">Click on a preset to add its override automatically.</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              v-for="preset in presets"
              :key="preset.name"
              class="border rounded p-4 flex flex-col justify-between hover:shadow-lg transition-shadow"
            >
              <div>
                <h3 class="text-lg font-bold flex items-center">
                  <LibraryIcon class="w-5 h-5 mr-2" />
                  {{ preset.name }}
                </h3>
                <p class="text-sm text-gray-500 mt-1 break-all">{{ preset.url }}</p>
              </div>
              <Button variant="success" class="mt-4" @click="addPresetOverride(preset)">
                <PlusIcon class="w-4 h-4 mr-1" />
                Add Override
              </Button>
            </div>
          </div>
        </section>
      </TabsContent>
    </Tabs>

    <!-- Global Reset Button -->
    <div class="mt-8 flex justify-end">
      <Button variant="warning" @click="openResetModal">
        <XIcon class="w-4 h-4 mr-1" />
        Reset All Overrides
      </Button>
    </div>

    <!-- Deletion / Reset Confirmation Modal -->
    <Dialog v-model="confirmModal.show" title="Confirm Deletion">
      <DialogContent>
        <p>
          Are you sure you want to delete
          <span v-if="confirmModal.details.type === 'import'">
            the override for <strong>{{ confirmModal.details.moduleName }}</strong
            >?
          </span>
          <span v-else-if="confirmModal.details.type === 'scope'">
            the override for <strong>{{ confirmModal.details.moduleName }}</strong> in scope
            <strong>{{ confirmModal.details.scope }}</strong
            >?
          </span>
          <span v-else-if="confirmModal.details.type === 'external'">
            the external override <strong>{{ confirmModal.details.url }}</strong
            >?
          </span>
        </p>
      </DialogContent>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button variant="secondary" @click="closeConfirmModal">Cancel</Button>
          <Button variant="destructive" @click="confirmDeletionAction">Delete</Button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import importMapOverrides from './newOneToSplit.ts'

// Import lucide-vue icons
import {
  ExternalLinkIcon,
  LibraryIcon,
  MenuIcon,
  PlusIcon,
  Trash2Icon,
  XIcon
} from 'lucide-vue-next'

// Import shadcn-vue components (adjust the paths based on your project structure)
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ImportOverrides {
  [moduleName: string]: string
}

interface ScopeOverrides {
  [scope: string]: { [moduleName: string]: string }
}

type DeletionType = 'import' | 'scope' | 'external'

interface ConfirmDetails {
  type: DeletionType
  moduleName?: string
  scope?: string
  url?: string
}

interface ConfirmModalState {
  show: boolean
  details: ConfirmDetails
}

// Active tab state (one of 'imports', 'scopes', 'externals', 'presets')
const activeTab = ref<'imports' | 'scopes' | 'externals' | 'presets'>('imports')

// Reactive states for the different override categories
const importOverrides = reactive<ImportOverrides>({})
const scopeOverrides = reactive<ScopeOverrides>({})
const externalOverrides = ref<string[]>([])

// Form models for new entries
const newOverride = reactive({ moduleName: '', url: '' })
const newScopeOverride = reactive({ scope: '', moduleName: '', url: '' })
const newExternalOverride = ref('')

// Preset library templates (for quick override setup)
const presets = ref([
  { name: 'React', url: 'https://unpkg.com/react/umd/react.development.js' },
  { name: 'React DOM', url: 'https://unpkg.com/react-dom/umd/react-dom.development.js' },
  { name: 'Vue', url: 'https://unpkg.com/vue/dist/vue.global.js' },
  { name: 'Angular', url: 'https://unpkg.com/@angular/core/bundles/core.umd.js' },
  { name: 'Lodash', url: 'https://unpkg.com/lodash/lodash.js' }
])

// Confirmation modal state for deletions
const confirmModal = reactive<ConfirmModalState>({
  show: false,
  details: { type: 'import' }
})

// Load current overrides from the API
function loadOverrides() {
  const map = importMapOverrides.getOverrideMap()
  Object.keys(map.imports).forEach((moduleName) => {
    importOverrides[moduleName] = map.imports[moduleName]
  })
  // Clear previous scope overrides
  for (const key in scopeOverrides) delete scopeOverrides[key]
  Object.keys(map.scopes).forEach((scope) => {
    scopeOverrides[scope] = { ...map.scopes[scope] }
  })
  externalOverrides.value = importMapOverrides.getExternalOverrides()
}

// Refresh UI state
function refreshOverrides() {
  for (const key in importOverrides) delete importOverrides[key]
  for (const key in scopeOverrides) delete scopeOverrides[key]
  loadOverrides()
}

// Add new import override with basic validation
function addImportOverride() {
  if (newOverride.moduleName.trim() && newOverride.url.trim()) {
    importMapOverrides.addOverride(newOverride.moduleName.trim(), newOverride.url.trim())
    newOverride.moduleName = ''
    newOverride.url = ''
    refreshOverrides()
  }
}

// Add new scope override
function addScopeOverride() {
  if (
    newScopeOverride.scope.trim() &&
    newScopeOverride.moduleName.trim() &&
    newScopeOverride.url.trim()
  ) {
    importMapOverrides.addScopeOverride(
      newScopeOverride.scope.trim(),
      newScopeOverride.moduleName.trim(),
      newScopeOverride.url.trim()
    )
    newScopeOverride.scope = ''
    newScopeOverride.moduleName = ''
    newScopeOverride.url = ''
    refreshOverrides()
  }
}

// Add new external override
function addExternalOverride() {
  if (newExternalOverride.value.trim()) {
    importMapOverrides.addExternalOverride(newExternalOverride.value.trim())
    newExternalOverride.value = ''
    refreshOverrides()
  }
}

// Add preset override directly as an import override
function addPresetOverride(preset: { name: string; url: string }) {
  importMapOverrides.addOverride(preset.name, preset.url)
  refreshOverrides()
}

// Open confirmation modal for deletions
function confirmDeletion(details: ConfirmDetails) {
  confirmModal.details = details
  confirmModal.show = true
}

// Confirm deletion action from modal
function confirmDeletionAction() {
  const details = confirmModal.details
  if (details.type === 'import' && details.moduleName) {
    importMapOverrides.removeOverride(details.moduleName)
  } else if (details.type === 'scope' && details.moduleName && details.scope) {
    importMapOverrides.removeScopeOverride(details.scope, details.moduleName)
  } else if (details.type === 'external' && details.url) {
    importMapOverrides.removeExternalOverride(details.url)
  }
  closeConfirmModal()
  refreshOverrides()
}

// Close the confirmation modal
function closeConfirmModal() {
  confirmModal.show = false
}

// Load overrides when component mounts
onMounted(() => {
  loadOverrides()
})
</script>

<style scoped>
/* Fade transition for modals and tab content */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
