<script>
  import { Button, Input, Label, Spinner } from 'flowbite-svelte';
  import { appStatusInfo, chatHistory, setAppStatusInit } from '../store.ts';

  const { id, url, pages } = $appStatusInfo;
  
  // Only create images array if we have valid URL and pages
  let images = [];
  if (url && pages) {
    const numOfImagesToShow = Math.min(pages, 4);
    images = Array.from({ length: numOfImagesToShow }, (_, i) => {
      const page = i + 1;
      return url
        .replace('/upload/', `/upload/w_400,h_540,c_fill,pg_${page}/`)
        .replace('.pdf', '.jpg');
    });
  }

  let loading = false;
  let currentAnswer = '';
  let inputValue = '';

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!inputValue.trim() || loading) return;

    loading = true;
    currentAnswer = '';
    
    const question = inputValue;
    // Add user message to history
    chatHistory.update(msgs => [...msgs, { role: 'user', content: question }]);
    
    const searchParams = new URLSearchParams();
    searchParams.append('id', id);
    searchParams.append('question', question);

    try {
      const eventSource = new EventSource(`/api/ask?${searchParams.toString()}`);
      
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.done) {
          // Add complete assistant message to history
          chatHistory.update(msgs => [...msgs, { role: 'assistant', content: currentAnswer }]);
          eventSource.close();
          loading = false;
          inputValue = '';
          return;
        }
        
        if (data.chunk) {
          currentAnswer += data.chunk;
        }
      };

      eventSource.onerror = (error) => {
        console.error('EventSource failed:', error);
        eventSource.close();
        loading = false;
      };
    } catch (error) {
      console.error('Error:', error);
      loading = false;
    }
  }

  const handleReturn = () => {
    setAppStatusInit();
  }

  // Auto-scroll to bottom when new messages arrive
  let chatContainer;
  $: if (chatContainer) {
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: 'smooth'
    });
  }
  $: {
    if (chatContainer && ($chatHistory || currentAnswer)) {
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  }
</script>

<div class="flex flex-col h-[calc(100vh-200px)]">
  <div class="flex justify-between items-center mb-4">
    <h3 class="text-2xl">Chat with AI about your document</h3>
    <Button color="light" on:click={handleReturn}>Try Other Document</Button>
  </div>

  <div class="grid grid-cols-4 gap-2 mb-4">
    {#each images as image}
      <!-- svelte-ignore a11y_img_redundant_alt -->
      <img
        class="rounded w-full h-auto aspect-[400/540]"
        src={image}
        alt="Image of the page of pdf"
      />
    {/each}
  </div>

  <div bind:this={chatContainer} class="flex-1 overflow-y-auto mb-4 space-y-4">
    {#each $chatHistory as message}
      <div class="p-4 rounded-lg" class:bg-gray-100={message.role === 'user'} class:bg-blue-50={message.role === 'assistant'}>
        <p class="font-semibold mb-1">{message.role === 'user' ? 'You' : 'AI'}</p>
        <p class="text-normal opacity-70 text-pretty">{message.content}</p>
      </div>
    {/each}
    
    {#if loading && currentAnswer}
      <div class="p-4 rounded-lg bg-blue-50">
        <p class="font-semibold mb-1">AI</p>
        <p class="text-normal opacity-70 text-pretty">{currentAnswer}</p>
      </div>
    {/if}
  </div>

  <div class="sticky bottom-0 bg-white mt-4 mb-8">
    <form on:submit={handleSubmit} class="flex gap-2">
      <div class="flex-1">
        <Input
          id="question"
          bind:value={inputValue}
          placeholder="Ask a question about the document..."
          required
        />
      </div>
      <Button type="submit" disabled={loading}>
        {#if loading}
          <Spinner size="4" class="mr-2" />
          Generating...
        {:else}
          Send
        {/if}
      </Button>
    </form>
  </div>
</div>