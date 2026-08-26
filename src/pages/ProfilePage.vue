<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

import ProfileForm from '@/components/organisms/ProfileForm.vue'
import type { UserProfile } from '@/types/profile'

const isEditing = ref(false)

const defaultProfile: UserProfile = {
  fullName: 'Jane Doe',
  email: 'jane@gmail.com',
  phone: '01234567890',
  avatar: '',
}

function loadProfile(): UserProfile {
  const savedProfile = localStorage.getItem('user-profile')

  if (!savedProfile) {
    return defaultProfile
  }

  try {
    const saved = JSON.parse(savedProfile) as UserProfile

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
    return defaultProfile
  }
}

const profile = ref<UserProfile>(loadProfile())

function handleEdit(): void {
  isEditing.value = true
}

function handleAvatarUpload(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  if (!file.type.startsWith('image/')) {
    alert('Please select an image file.')
    input.value = ''
    return
  }

  const maxFileSize = 2 * 1024 * 1024

  if (file.size > maxFileSize) {
    alert('Profile image must be smaller than 2 MB.')
    input.value = ''
    return
  }

  const reader = new FileReader()

  reader.onload = () => {
    if (typeof reader.result !== 'string') {
      return
    }

    profile.value.avatar = reader.result

    localStorage.setItem('user-profile', JSON.stringify(profile.value))
  }

  reader.readAsDataURL(file)

  input.value = ''
}

function handleSave(updatedProfile: UserProfile): void {
  profile.value = {
    fullName: updatedProfile.fullName.trim(),
    email: updatedProfile.email.trim(),
    phone: updatedProfile.phone.trim(),
    avatar: profile.value.avatar,
  }

  localStorage.setItem('user-profile', JSON.stringify(profile.value))

  isEditing.value = false
}
</script>

<template>
  <main class="profile-page">
    <div class="profile-page__container">
      <header class="profile-page__header">
        <RouterLink class="profile-page__back" to="/" aria-label="Back to weather"> ‹ </RouterLink>

        <h1>Edit Profile</h1>
      </header>

      <section class="profile-page__intro">
        <label class="profile-page__avatar" for="avatar-upload" title="Change profile picture">
          <img v-if="profile.avatar" :src="profile.avatar" alt="Profile picture" />

          <span v-else class="profile-page__avatar-placeholder" aria-hidden="true"> 👤 </span>
        </label>

        <input
          id="avatar-upload"
          class="profile-page__avatar-input"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          @change="handleAvatarUpload"
        />

        <label class="profile-page__photo-button" for="avatar-upload">
          {{ profile.avatar ? 'Edit Photo' : 'Choose Photo' }}
        </label>

        <h2>
          {{ profile.fullName }}
        </h2>

        <p>
          {{ profile.email }}
          |
          {{ profile.phone }}
        </p>
      </section>

      <div class="profile-page__form">
        <ProfileForm :profile="profile" :is-editing="isEditing" @save="handleSave" />
      </div>

      <button v-if="!isEditing" class="profile-page__edit" type="button" @click="handleEdit">
        EDIT
      </button>
    </div>
  </main>
</template>

<style scoped lang="scss">
.profile-page {
  min-height: 100vh;

  background: linear-gradient(180deg, #f4f6ff 0, #f4f6ff 310px, #ffffff 310px);

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

  &__back {
    position: absolute;
    left: 0;

    color: var(--color-text);

    font-size: 38px;
    line-height: 1;

    text-decoration: none;
  }

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

    img {
      width: 100%;
      height: 100%;

      display: block;

      object-fit: cover;
      object-position: center;
    }
  }

  &__avatar-input {
    display: none;
  }

  &__photo-button {
    display: inline-block;

    margin-top: 12px;

    color: #2f416f;

    font-size: 16px;
    font-weight: 600;

    cursor: pointer;
  }

  &__form {
    margin-top: 46px;
    margin-bottom: 40px;
  }

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
