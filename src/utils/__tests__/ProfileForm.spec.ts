import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import ProfileForm from '@/components/organisms/ProfileForm.vue'

const validProfile = {
  fullName: 'Jane Doe',
  email: 'jane@gmail.com',
  phone: '01234567890',
}

describe('ProfileForm', () => {
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

    expect(wrapper.emitted('save')).toBeTruthy()

    expect(wrapper.emitted('save')?.[0]).toEqual([
      {
        fullName: 'John Smith',
        email: 'john@gmail.com',
        phone: '04123456789',
      },
    ])
  })
})
