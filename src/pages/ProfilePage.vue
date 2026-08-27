<!--
  ProfilePage.vue

  Purpose:
  Displays and manages the user's profile page.
  The page allows users to view and edit their personal information,
  upload a profile picture, and save their profile details locally
  using the browser's localStorage.
-->

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

import ProfileForm from '@/components/organisms/ProfileForm.vue'
import type { UserProfile } from '@/types/profile'

// Tracks whether the profile form is currently editable.
const isEditing = ref(false)

// Default profile information used when no saved profile
// exists in the browser's localStorage.
const defaultProfile: UserProfile = {
  fullName: 'Jane Doe',
  email: 'jane@gmail.com',
  phone: '01234567890',
  avatar: '',
}

// Loads previously saved profile information from localStorage.
// If no valid saved profile exists, the default profile is returned.
function loadProfile(): UserProfile {
  const savedProfile = localStorage.getItem('user-profile')

  if (!savedProfile) {
    return defaultProfile
  }

  try {
    const saved = JSON.parse(savedProfile) as UserProfile

    // Ensures the stored profile contains the expected data types
    // before using it in the application.
    if (
      typeof saved.fullName !== 'string' ||
      typeof saved.email !== 'string' ||
      typeof saved.phone !== 'string' ||
      (saved.avatar !== undefined && typeof saved.avatar !== 'string')
    ) {
      return defaultProfile
    }

    return saved
  } catch {
    // Falls back to the default profile if the saved
    // localStorage data cannot be parsed correctly.
    return defaultProfile
  }
}

// Creates the reactive user profile displayed on the page.
const profile = ref<UserProfile>(loadProfile())

// Enables editing when the user clicks the EDIT button.
function handleEdit(): void {
  isEditing.value = true
}

// Handles profile picture uploads from the user's device.
function handleAvatarUpload(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  // Stops if the user did not select a file.
  if (!file) {
    return
  }

  // Ensures the selected file is an image.
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file.')
    input.value = ''
    return
  }

  // Limits uploaded profile pictures to a maximum size of 2 MB.
  const maxFileSize = 2 * 1024 * 1024

  if (file.size > maxFileSize) {
    alert('Profile image must be smaller than 2 MB.')
    input.value = ''
    return
  }

  // FileReader converts the selected image into a data URL
  // so that it can be displayed and stored in localStorage.
  const reader = new FileReader()

  reader.onload = () => {
    if (typeof reader.result !== 'string') {
      return
    }

    profile.value.avatar = reader.result

    // Saves the new profile image together with the existing profile data.
    localStorage.setItem('user-profile', JSON.stringify(profile.value))
  }

  reader.readAsDataURL(file)

  // Clears the file input so the same image can be selected again if needed.
  input.value = ''
}

// Receives validated profile information from ProfileForm
// and saves the updated profile to localStorage.
function handleSave(updatedProfile: UserProfile): void {
  profile.value = {
    fullName: updatedProfile.fullName.trim(),
    email: updatedProfile.email.trim(),
    phone: updatedProfile.phone.trim(),
    avatar: profile.value.avatar,
  }

  localStorage.setItem('user-profile', JSON.stringify(profile.value))

  // Returns the form to read-only mode after successfully saving.
  isEditing.value = false
}
</script>

<template>
  <!-- Main container for the profile page. -->
  <main class="profile-page">
    <div class="profile-page__container">
      <!-- Page header containing navigation and the page title. -->
      <header class="profile-page__header">
        <RouterLink class="profile-page__back" to="/" aria-label="Back to weather"> ‹ </RouterLink>

        <h1>Edit Profile</h1>
      </header>

      <!-- Displays the profile picture and summary information. -->
      <section class="profile-page__intro">
        <!--
          Clicking the avatar opens the device's file picker,
          allowing the user to choose a new profile picture.
        -->
        <label class="profile-page__avatar" for="avatar-upload" title="Change profile picture">
          <img v-if="profile.avatar" :src="profile.avatar" alt="Profile picture" />

          <!-- Default icon shown when no profile picture has been uploaded. -->
          <span v-else class="profile-page__avatar-placeholder" aria-hidden="true"> 👤 </span>
        </label>

        <!-- Hidden file input used to select an image from the user's device. -->
        <input
          id="avatar-upload"
          class="profile-page__avatar-input"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          @change="handleAvatarUpload"
        />

        <!-- Provides another visible control for selecting or changing the profile image. -->
        <label class="profile-page__photo-button" for="avatar-upload">
          {{ profile.avatar ? 'Edit Photo' : 'Choose Photo' }}
        </label>

        <!-- Displays the user's current profile summary. -->
        <h2>
          {{ profile.fullName }}
        </h2>

        <p>
          {{ profile.email }}
          |
          {{ profile.phone }}
        </p>
      </section>

      <!--
        ProfileForm handles displaying, editing, and validating
        the user's name, email, and phone number.
      -->
      <div class="profile-page__form">
        <ProfileForm :profile="profile" :is-editing="isEditing" @save="handleSave" />
      </div>

      <!-- Enables profile editing when the form is currently read-only. -->
      <button v-if="!isEditing" class="profile-page__edit" type="button" @click="handleEdit">
        EDIT
      </button>
    </div>
  </main>
</template>

<style scoped lang="scss">
.profile-page {
  // Creates the page background with a light-coloured upper section.
  min-height: 100vh;

  background: linear-gradient(180deg, #f4f6ff 0, #f4f6ff 310px, #ffffff 310px);

  // Controls the maximum page width and overall vertical layout.
  &__container {
    position: relative;

    width: 100%;
    max-width: 680px;
    min-height: 100vh;

    margin: 0 auto;
    padding: 38px 28px 24px;

    display: flex;
    flex-direction: column;
  }

  // Centers the page title while keeping the back control on the left.
  &__header {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: center;

    h1 {
      margin: 0;

      font-size: 30px;
      font-weight: 700;
    }
  }

  // Styles and positions the navigation link back to the weather page.
  &__back {
    position: absolute;
    left: 0;

    color: var(--color-text);

    font-size: 38px;
    line-height: 1;

    text-decoration: none;
  }

  // Centers the profile image and basic user information.
  &__intro {
    margin-top: 30px;

    text-align: center;

    h2 {
      margin: 18px 0 6px;

      font-size: 24px;
      font-weight: 500;
    }

    p {
      margin: 0;

      font-size: 17px;
    }
  }

  // Creates the circular profile image area.
  &__avatar {
    width: 150px;
    height: 150px;

    margin: 0 auto;

    display: flex;
    align-items: center;
    justify-content: center;

    overflow: hidden;

    border-radius: 50%;

    background: #a8def4;

    font-size: 76px;

    cursor: pointer;

    // Ensures uploaded profile images fill the circular avatar area.
    img {
      width: 100%;
      height: 100%;

      display: block;

      object-fit: cover;
      object-position: center;
    }
  }

  // Hides the native file input because the avatar and
  // photo label are used to open the file picker instead.
  &__avatar-input {
    display: none;
  }

  // Styles the Choose Photo / Edit Photo control.
  &__photo-button {
    display: inline-block;

    margin-top: 12px;

    color: #2f416f;

    font-size: 16px;
    font-weight: 600;

    cursor: pointer;
  }

  // Provides spacing around the profile form.
  &__form {
    margin-top: 46px;
    margin-bottom: 40px;
  }

  // Styles the button used to enable profile editing.
  &__edit {
    width: 100%;

    margin-top: auto;

    padding: 18px 20px;

    border: none;
    border-radius: 12px;

    background: #2f416f;
    color: white;

    font-size: 19px;
    font-weight: 700;

    cursor: pointer;
  }
}

// Adjusts the profile layout for smaller mobile screens.
@media (max-width: 480px) {
  .profile-page {
    &__container {
      padding: 30px 20px 18px;
    }

    &__header {
      h1 {
        font-size: 26px;
      }
    }

    &__intro {
      margin-top: 25px;
    }

    &__avatar {
      width: 130px;
      height: 130px;

      font-size: 66px;
    }

    &__form {
      margin-top: 36px;
      margin-bottom: 32px;
    }
  }
}
</style>
