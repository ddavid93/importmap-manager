import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AddImport from '@/components/AddImport.vue'
import { Button } from '@/components/ui/button'

describe('AddImport', () => {
  it('renders the button with the correct label from btnTriggerLabel prop', () => {
    const wrapper = mount(AddImport, {
      props: {
        btnTriggerLabel: 'Open Dialog',
        btnFooterLabel: 'Submit',
        title: 'Add Import'
      }
    })
    expect(wrapper.findComponent(Button).text()).toBe('Open Dialog')
  })
})
