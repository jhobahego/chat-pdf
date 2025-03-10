<script>
  import { Alert } from 'flowbite-svelte';
  import { APP_STATUS, appStatus } from '../store.ts';
  import StepUpload from './StepUpload.svelte';
  import StepLoading from './StepLoading.svelte';
  import StepChatMode from './StepChat.svelte';
</script>

<div>
  {#if $appStatus === APP_STATUS.INIT}
  <p class="text-normal md:text-xl font-light mb-4 opacity-80">Drag documents in drag and drop for chating about this document with ChatPDF</p>
  <StepUpload />
  {:else if $appStatus === APP_STATUS.CHAT_MODE}
  <StepChatMode />
  {:else if $appStatus === APP_STATUS.LOADING}
  <StepLoading />
  {:else if $appStatus === APP_STATUS.ERROR}
  <Alert color="red">
    <span class="font-medium">Important!</span>
    An error was ocurred
  </Alert>
  {/if}
</div>