<!--
  ProfileForm.vue

  Purpose:
  Displays and manages the editable user profile form.
  It allows the user to update their full name, email address, and phone number.
  The component validates the entered information before emitting the updated
  profile data to the parent component for saving.
-->

<script setup lang="ts">
import { reactive, watch } from 'vue'

import type { UserProfile } from '@/types/profile'

// Receives the current user profile and whether the form
// is currently in editing mode from the parent component.
const props = defineProps<{
  profile: UserProfile
  isEditing: boolean
}>()
///

// Emits the validated profile information to the parent
// component when the user successfully saves the form.
const emit = defineEmits<{
  save: [profile: UserProfile]
}>()

// Defines the possible validation errors for each profile field.
interface ProfileErrors {
  fullName?: string
  email?: string
  phone?: string
}

// Creates a reactive copy of the profile information
// that can be edited through the form inputs.
const form = reactive<UserProfile>({
  fullName: props.profile.fullName,
  email: props.profile.email,
  phone: props.profile.phone,
})

// Stores validation error messages for the form fields.
const errors = reactive<ProfileErrors>({})

// Watches for changes to the profile received from the parent
// and keeps the local form values synchronized with it.
watch(
  () => props.profile,
  (newProfile) => {
    form.fullName = newProfile.fullName
    form.email = newProfile.email
    form.phone = newProfile.phone
  },
  {
    deep: true,
  },
)

// Removes any existing validation error messages
// before the form is validated again.
function clearErrors(): void {
  errors.fullName = undefined
  errors.email = undefined
  errors.phone = undefined
}

// Validates the user's profile information before it can be saved.
function validate(): boolean {
  clearErrors()

  const fullName = form.fullName.trim()
  const email = form.email.trim()
  const phone = form.phone.trim()

  // Checks that a valid full name has been entered.
  if (!fullName) {
    errors.fullName = 'Full name is required.'
  } else if (fullName.length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.'
  }

  // Checks that an email has been entered
  // and follows a valid email address format.
  if (!email) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.'
  }

  // Checks that a phone number has been entered
  // and contains exactly 11 digits.
  if (!phone) {
    errors.phone = 'Phone number is required.'
  } else {
    const digitsOnly = phone.replace(/\D/g, '')

    if (digitsOnly.length !== 11) {
      errors.phone = 'Phone number must contain exactly 11 digits.'
    }
  }

  // Validation succeeds only when all fields are free of errors.
  return !errors.fullName && !errors.email && !errors.phone
}

// Validates the form when submitted and sends the cleaned
// profile information to the parent component if validation succeeds.
function handleSubmit(): void {
  if (!validate()) {
    return
  }

  emit('save', {
    fullName: form.fullName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
  })
}
</script>

<template>
  <!-- Profile form. The default browser submission is prevented
       so the form can be handled through Vue instead. -->
  <form class="profile-form" @submit.prevent="handleSubmit">
    <!-- Full name field and its validation message. -->
    <div class="profile-form__field">
      <label for="full-name"> Full name </label>

      <input
        id="full-name"
        v-model="form.fullName"
        type="text"
        :readonly="!isEditing"
        :aria-invalid="Boolean(errors.fullName)"
        :aria-describedby="errors.fullName ? 'full-name-error' : undefined"
      />

      <p v-if="errors.fullName" id="full-name-error" class="profile-form__error">
        {{ errors.fullName }}
      </p>
    </div>

    <!-- Email field and its validation message. -->
    <div class="profile-form__field">
      <label for="email"> Email </label>

      <input
        id="email"
        v-model="form.email"
        type="email"
        :readonly="!isEditing"
        :aria-invalid="Boolean(errors.email)"
        :aria-describedby="errors.email ? 'email-error' : undefined"
      />

      <p v-if="errors.email" id="email-error" class="profile-form__error">
        {{ errors.email }}
      </p>
    </div>

    <!-- Phone number field and its validation message. -->
    <div class="profile-form__field">
      <label for="phone"> Phone Number </label>

      <input
        id="phone"
        v-model="form.phone"
        type="tel"
        :readonly="!isEditing"
        :aria-invalid="Boolean(errors.phone)"
        :aria-describedby="errors.phone ? 'phone-error' : undefined"
      />

      <p v-if="errors.phone" id="phone-error" class="profile-form__error">
        {{ errors.phone }}
      </p>
    </div>

    <!-- The save button is only displayed while the profile is being edited. -->
    <button v-if="isEditing" class="profile-form__save" type="submit">SAVE</button>
  </form>
</template>

<style scoped lang="scss">
.profile-form {
  // Arranges the profile fields vertically with consistent spacing.
  display: grid;
  gap: 18px;

  // Styles each individual profile input container.
  &__field {
    display: grid;
    gap: 6px;

    padding: 14px 18px;

    border-radius: 14px;

    background: #f4f4f4;

    // Styles the label displayed above each input.
    label {
      color: #8b8b8b;

      font-size: 12px;
    }

    // Styles the editable profile input.
    input {
      width: 100%;

      padding: 0;

      border: none;
      outline: none;

      background: transparent;

      color: var(--color-text);

      font-size: 18px;
      font-weight: 500;

      // Prevents the read-only fields from appearing interactive.
      &:read-only {
        cursor: default;
      }
    }

    // Highlights the field container when one of its inputs has focus.
    &:focus-within {
      outline: 2px solid #8fa9e8;
    }
  }

  // Styles validation error messages.
  &__error {
    margin: 2px 0 0;

    color: #b42318;

    font-size: 12px;
  }

  // Styles the button used to save profile changes.
  &__save {
    width: 100%;

    margin-top: 12px;

    padding: 16px 20px;

    border: none;
    border-radius: 12px;

    background: #2f416f;
    color: white;

    font-size: 18px;
    font-weight: 700;

    cursor: pointer;
  }
}
</style>
