<script lang="ts">
  import Empty from '@/components/material/Empty.svelte'
  import MusicList from '@/components/common/MusicList/MusicList.svelte'
  import type { SourceType } from '../shared'
  import Pagination from '@/components/material/Pagination.svelte'
  import { search } from '@/modules/extension/onlineResource/search/music/actions'
  import { query, push } from '@/plugins/routes'
  import { t } from '@/plugins/i18n'

  let {
    source,
    loading = $bindable(false),
  }: {
    source?: SourceType
    loading?: boolean
  } = $props()

  let list = $state.raw<AnyListen.Music.MusicInfoOnline[]>([])
  let listInfo = $state<{
    total: number
    page: number
    limit: number
    error: boolean
    timeout: boolean
  }>({ total: 0, page: 1, limit: 20, error: false, timeout: false })
  const searchInfo = {
    extId: '',
    source: '',
    text: '',
  }
  let currentSearchId = $state('')

  const SEARCH_TIMEOUT = 10_000

  const handleSearch = (page: number, text?: string) => {
    let extId = (searchInfo.extId = source!.extensionId)
    let sourceId = (searchInfo.source = source!.id)
    if (text != null) searchInfo.text = text
    listInfo.page = page
    listInfo.error = false
    listInfo.timeout = false
    const searchId = `${searchInfo.extId}_${searchInfo.source}_${searchInfo.text}_${listInfo.page}`
    currentSearchId = searchId
    loading = true

    const searchPromise = search(extId, sourceId, searchInfo.text, '', page, listInfo.limit)

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('SEARCH_TIMEOUT')), SEARCH_TIMEOUT)
    })

    void Promise.race([searchPromise, timeoutPromise])
      .then(({ list: _list, total }) => {
        if (currentSearchId !== searchId) return
        listInfo.total = total
        // Keep previous results when API returns empty (don't clear the list)
        if (_list.length > 0 || list.length === 0) list = _list
      })
      .catch((err: Error) => {
        if (currentSearchId !== searchId) return
        if (err.message === 'SEARCH_TIMEOUT') {
          listInfo.timeout = true
        } else {
          listInfo.error = true
        }
        list = []
      })
      .finally(() => {
        if (currentSearchId === searchId) loading = false
      })
  }

  $effect(() => {
    if (!source) return
    let page = 1
    if ($query.page) {
      let p = parseInt($query.page)
      if (Number.isNaN(p)) p = 1
      page = p
    }
    handleSearch(page, $query.text || '')
  })
</script>

<div class="music-list">
  {#if source}
    {#if loading}
      <div class="loading-overlay">
        <div class="loading-spinner"></div>
        <span class="loading-text">{$t('loading')}</span>
      </div>
    {:else if listInfo.timeout}
      <div class="status-message error">{$t('search__load_failed')}</div>
    {:else if listInfo.error}
      <div class="status-message error">{$t('search__load_failed')}</div>
    {:else if !list.length}
      <Empty />
    {:else}
      <MusicList
        {list}
        miniheader
        listinfo={{
          id: 'search',
          name: 'search',
        }}
      />
    {/if}
    {#if !loading && list.length}
      <div class="pagination">
        <Pagination
          count={listInfo.total}
          page={listInfo.page}
          limit={listInfo.limit}
          onclick={(page) => {
            void push('/online', {
              ...$query,
              page,
            })
          }}
        />
      </div>
    {/if}
  {:else}
    <Empty />
  {/if}
</div>

<style lang="less">
  .music-list {
    display: flex;
    flex: auto;
    flex-flow: column nowrap;
    min-width: 0;
    overflow: hidden;
    position: relative;
  }
  .loading-overlay {
    display: flex;
    flex: auto;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    gap: 12px;
    opacity: 0.7;
    pointer-events: none;
  }
  .loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--color-primary-light-300-alpha-700);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .loading-text {
    font-size: 13px;
    color: var(--color-primary-font);
  }
  .status-message {
    display: flex;
    flex: auto;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    &.error {
      color: var(--color-font-error);
    }
  }
  .pagination {
    display: flex;
    justify-content: center;
    padding: 10px 0;
  }
</style>
