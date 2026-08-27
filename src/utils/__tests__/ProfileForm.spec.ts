/*
  ProfileForm.spec.ts

  Purpose:
  Contains unit tests for the ProfileForm component using Vitest
  and Vue Test Utils. These tests check that profile information
  is displayed correctly, invalid input produces validation errors,
  and valid profile information emits the expected save event.
*/

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import ProfileForm from '@/components/organisms/ProfileForm.vue'

// Provides valid profile data that can be reused
// as the starting point for each test.
const validProfile = {
  fullName: 'Jane Doe',
  email: 'jane@gmail.com',
  phone: '01234567890',
}

// Groups all tests related to the ProfileForm component.
describe('ProfileForm', () => {
  // Checks that the values passed through the profile prop
  // are correctly displayed in each input field.
  it('displays the current profile details', () => {
    const wrapper = mount(ProfileForm, {
      props: {
        profile: validProfile,
        isEditing: true,
      },
    })

    expect((wrapper.get('#full-name').element as HTMLInputElement).value).toBe('Jane Doe')

    expect((wrapper.get('#email').element as HTMLInputElement).value).toBe('jane@gmail.com')

    expect((wrapper.get('#phone').element as HTMLInputElement).value).toBe('01234567890')
  })

  // Checks that a phone number containing fewer than
  // 11 digits produces the correct validation error.
  it('shows an error when the phone number has fewer than 11 digits', async () => {
    const wrapper = mount(ProfileForm, {
      props: {
        profile: validProfile,
        isEditing: true,
      },
    })

    await wrapper.get('#phone').setValue('0123456789')

    await wrapper.get('form').trigger('submit')

    expect(wrapper.text()).toContain('Phone number must contain exactly 11 digits.')
  })

  // Checks that a phone number containing more than
  // 11 digits also produces the correct validation error.
  it('shows an error when the phone number has more than 11 digits', async () => {
    const wrapper = mount(ProfileForm, {
      props: {
        profile: validProfile,
        isEditing: true,
      },
    })

    await wrapper.get('#phone').setValue('012345678901')

    await wrapper.get('form').trigger('submit')

    expect(wrapper.text()).toContain('Phone number must contain exactly 11 digits.')
  })

  // Checks that an incorrectly formatted email address
  // produces the expected validation error.
  it('shows an error for an invalid email address', async () => {
    const wrapper = mount(ProfileForm, {
      props: {
        profile: validProfile,
        isEditing: true,
      },
    })

    await wrapper.get('#email').setValue('invalid-email')

    await wrapper.get('form').trigger('submit')

    expect(wrapper.text()).toContain('Enter a valid email address.')
  })

  // Checks that the full name cannot be left empty.
  it('shows an error when the full name is empty', async () => {
    const wrapper = mount(ProfileForm, {
      props: {
        profile: validProfile,
        isEditing: true,
      },
    })

    await wrapper.get('#full-name').setValue('')

    await wrapper.get('form').trigger('submit')

    expect(wrapper.text()).toContain('Full name is required.')
  })

  // Checks the successful submission path.
  // When every field is valid, the component should emit
  // a save event containing the updated profile information.
  it('emits save when all profile details are valid', async () => {
    const wrapper = mount(ProfileForm, {
      props: {
        profile: validProfile,
        isEditing: true,
      },
    })

    await wrapper.get('#full-name').setValue('John Smith')
    await wrapper.get('#email').setValue('john@gmail.com')
    await wrapper.get('#phone').setValue('04123456789')

    await wrapper.get('form').trigger('submit')

    // Confirms that the save event occurred.
    expect(wrapper.emitted('save')).toBeTruthy()

    // Confirms that the save event contains
    // exactly the expected updated profile information.
    expect(wrapper.emitted('save')?.[0]).toEqual([
      {
        fullName: 'John Smith',
        email: 'john@gmail.com',
        phone: '04123456789',
      },
    ])
  })
})
