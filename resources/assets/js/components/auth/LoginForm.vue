<template>
  <form :class="{ error: failed }" data-testid="login-form" @submit.prevent="login">
    <div class="logo">
      <img alt="Koel's logo" src="@/../img/logo.svg" width="156">
    </div>
    <input v-model="email" autofocus placeholder="Email Address" required type="email">
    <input v-model="password" placeholder="Password" required type="password">
    <Btn type="submit">Log In</Btn>
  </form>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { userStore } from '@/stores'
import { isDemo } from '@/utils'

import Btn from '@/components/ui/Btn.vue'

const DEMO_ACCOUNT = {
  email: 'demo@koel.dev',
  password: 'demo'
}

const url = ref('')
const email = ref(isDemo ? DEMO_ACCOUNT.email : '')
const password = ref(isDemo ? DEMO_ACCOUNT.password : '')
const failed = ref(false)

const emit = defineEmits(['loggedin'])

const login = async () => {
  try {
    await userStore.login(email.value, password.value)
    failed.value = false

    // Reset the password so that the next login will have this field empty.
    password.value = ''

    emit('loggedin')
  } catch (err) {
    failed.value = true
    window.setTimeout(() => (failed.value = false), 2000)
  }
}
</script>

<style lang="scss" scoped>
/**
 * I like to move it move it
 * I like to move it move it
 * I like to move it move it
 * You like to - move it!
 */
@keyframes shake {
  8%, 41% {
    transform: translateX(-10px);
  }
  25%, 58% {
    transform: translateX(10px);
  }
  75% {
    transform: translateX(-5px);
  }
  92% {
    transform: translateX(5px);
  }
  0%, 100% {
    transform: translateX(0);
  }
}

form {
  width: 280px;
  padding: 1.8rem;
  background: rgba(255, 255, 255, .08);
  border-radius: .6rem;
  border: 1px solid transparent;
  transition: .5s;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &.error {
    border-color: var(--color-red);
    animation: shake .5s;
  }

  .logo {
    text-align: center;
  }

  @media only screen and (max-width: 414px) {
    border: 0;
    background: transparent;
  }
}
</style>
