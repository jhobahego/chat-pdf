<script>
  import { Button, Input, Label, Spinner } from 'flowbite-svelte';
  import { appStatusInfo, chatHistory, setAppStatusInit } from '../store.ts';
  import { marked } from 'marked';

  marked.setOptions({
    breaks: true,
    gfm: true
  });

  const renderMarkdown = (text) => {
    if (!text) return '';
    // Normalize lists that lack preceding newlines after periods or colons
    const normalized = text.replace(/([.:])\s+\*\s+(\*\*|[A-Za-z0-9])/g, '$1\n\n* $2');
    return marked.parse(normalized);
  };

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
        const incomingData = JSON.parse(event.data);

        if (incomingData === '__END__') {
          // Add complete assistant message to history
          chatHistory.update(msgs => [...msgs, { role: 'assistant', content: currentAnswer }]);
          eventSource.close();
          loading = false;
          inputValue = '';
          return;
        }

        currentAnswer += incomingData;
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
        {#if message.role === 'assistant'}
          <div class="markdown-content text-normal opacity-80 text-pretty">
            {@html renderMarkdown(message.content)}
          </div>
        {:else}
          <p class="text-normal opacity-70 text-pretty">{message.content}</p>
        {/if}
      </div>
    {/each}
    
    {#if loading && currentAnswer}
      <div class="p-4 rounded-lg bg-blue-50">
        <p class="font-semibold mb-1">AI</p>
        <div class="markdown-content text-normal opacity-80 text-pretty">
          {@html renderMarkdown(currentAnswer)}
        </div>
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

<style>
  :global(.markdown-content) {
    line-height: 1.625;
  }
  :global(.markdown-content p) {
    margin-bottom: 0.75rem;
  }
  :global(.markdown-content p:last-child) {
    margin-bottom: 0;
  }
  :global(.markdown-content ul) {
    list-style-type: disc;
    padding-left: 1.25rem;
    margin-top: 0.5rem;
    margin-bottom: 0.75rem;
  }
  :global(.markdown-content ol) {
    list-style-type: decimal;
    padding-left: 1.25rem;
    margin-top: 0.5rem;
    margin-bottom: 0.75rem;
  }
  :global(.markdown-content li) {
    margin-bottom: 0.25rem;
  }
  :global(.markdown-content strong) {
    font-weight: 600;
  }
  :global(.markdown-content em) {
    font-style: italic;
  }
  :global(.markdown-content code) {
    background-color: rgba(0, 0, 0, 0.06);
    padding: 0.15rem 0.35rem;
    border-radius: 0.25rem;
    font-size: 0.875em;
    font-family: monospace;
  }
  :global(.markdown-content pre) {
    background-color: #1f2937;
    color: #f9fafb;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin-top: 0.5rem;
    margin-bottom: 0.75rem;
  }
  :global(.markdown-content pre code) {
    background-color: transparent;
    padding: 0;
    color: inherit;
    font-size: 0.875rem;
  }
  :global(.markdown-content a) {
    color: #2563eb;
    text-decoration: underline;
  }
  :global(.markdown-content a:hover) {
    color: #1d4ed8;
  }
  :global(.markdown-content blockquote) {
    border-left: 3px solid #cbd5e1;
    padding-left: 0.75rem;
    font-style: italic;
    margin-top: 0.5rem;
    margin-bottom: 0.75rem;
  }
</style>