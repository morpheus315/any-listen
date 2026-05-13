<script lang="ts">
  import type { ResourceListType } from '../../shared'
  import { getSourceId } from '../shared'
  import Source from '../Source.svelte'
  import { query, replace } from '@/plugins/routes'
  import SearchInput from '@/components/material/SearchInput.svelte'
  import { t } from '@/plugins/i18n'
  import List from './List.svelte'

  let { sourceList }: { sourceList: NonNullable<ResourceListType['musicSearch']> } = $props()
  let list = $derived(sourceList.map((s) => ({ ...s, sId: getSourceId(s) })))
  let activeSource = $derived($query.source ? list.find((s) => s.sId == $query.source) : list[0])
  let loading = $state(false)

  const handleSearch = (text: string) => {
    void replace('/online', {
      type: $query.type,
      searchType: $query.searchType,
      source: activeSource?.sId,
      text: text.trim(),
      page: 1,
    })
  }

  const handleSourceChange = (source: any) => {
    if (loading) return
    void replace('/online', {
      type: $query.type,
      searchType: $query.searchType,
      source: source.sId,
      text: $query.text,
      page: 1,
    })
  }
</script>

<div class="online-search-music">
  {#if list.length}
    <div class="source-list-wrapper" class:disabled={loading}>
      <Source
        {list}
        active={activeSource?.sId}
        onchange={handleSourceChange}
      />
    </div>
  {/if}
  <div class="search-content">
    {#if activeSource}
      <div class="search-bar" class:disabled={loading}>
        <SearchInput
          --width="100%"
          placeholder={$t('search')}
          onsubmit={handleSearch}
        />
      </div>
      <List source={activeSource} bind:loading />
    {:else}
      <div class="empty-hint">{$t('online__select_source_hint')}</div>
    {/if}
  </div>
</div>

<style lang="less">
  .online-search-music {
    display: flex;
    flex-flow: row nowrap;
    height: 100%;
    padding-top: 10px;
  }
  .source-list-wrapper {
    flex: none;
    width: 18%;
    max-width: 200px;
    transition: opacity 0.2s;
    &.disabled {
      opacity: 0.4;
      pointer-events: none;
    }
    :global(.source-list) {
      width: 100%;
      max-width: none;
      margin-left: 0;
    }
  }
  .search-content {
    display: flex;
    flex: auto;
    flex-flow: column nowrap;
    min-width: 0;
    overflow: hidden;
  }
  .search-bar {
    flex: none;
    padding: 0 15px 10px 15px;
    transition: opacity 0.2s;
    &.disabled {
      opacity: 0.4;
      pointer-events: none;
    }
  }
  .empty-hint {
    display: flex;
    flex: auto;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: var(--color-primary-font);
    opacity: 0.5;
  }
</style>
