<script lang="ts">
  import { t } from '@/plugins/i18n'
  import TitleContent from '../components/TitleContent.svelte'
  import Btn from '@/components/base/Btn.svelte'
  import { onMount } from 'svelte'
  import { showNotify } from '@/components/apis/notify'
  import {
    getMusicUrlCount,
    clearMusicUrl,
    getMusicLyricCount,
    clearMusicLyric,
    getMusicOtherSourceCount,
    clearMusicOtherSource,
    getPlayCountCount,
    clearPlayCount,
    getDownloadListCount,
    clearDownloadList,
  } from '@/shared/ipc/music'
  import { clearAllQualities, getQualityCount } from '@/modules/player/store/qualityLabels.svelte'
  import { clearAllMeta, getMetaCount } from '@/modules/player/store/songMetaCache.svelte'

  let musicUrlCacheSize = $state(0)
  let musicLyricCacheSize = $state(0)
  let qualityLabelSize = $state(0)
  let songMetaCacheSize = $state(0)
  let otherSourceSize = $state(0)
  let playCountSize = $state(0)
  let downloadListSize = $state(0)

  onMount(() => {
    let mounted = true
    void getMusicUrlCount().then((count) => { if (!mounted) return; musicUrlCacheSize = count })
    void getMusicLyricCount().then((count) => { if (!mounted) return; musicLyricCacheSize = count })
    void getMusicOtherSourceCount().then((count) => { if (!mounted) return; otherSourceSize = count })
    void getPlayCountCount().then((count) => { if (!mounted) return; playCountSize = count })
    void getDownloadListCount().then((count) => { if (!mounted) return; downloadListSize = count })
    qualityLabelSize = getQualityCount()
    songMetaCacheSize = getMetaCount()
    return () => { mounted = false }
  })

  const handleClear = async (clearFn: () => Promise<void>, sizeRef: { set: (v: number) => void }) => {
    await clearFn().catch((err: Error) => {
      showNotify($t('settings.other.clear_cache_failed', { msg: err.message }))
      throw err
    })
    sizeRef.set(0)
    showNotify($t('settings.other.clear_cache_success'))
  }

  const handleClearAll = async () => {
    try {
      if (musicUrlCacheSize) { await clearMusicUrl(); musicUrlCacheSize = 0 }
      if (musicLyricCacheSize) { await clearMusicLyric(); musicLyricCacheSize = 0 }
      if (otherSourceSize) { await clearMusicOtherSource(); otherSourceSize = 0 }
      if (playCountSize) { await clearPlayCount(); playCountSize = 0 }
      if (downloadListSize) { await clearDownloadList(); downloadListSize = 0 }
      clearAllQualities(); qualityLabelSize = 0
      clearAllMeta(); songMetaCacheSize = 0
      showNotify($t('settings.other.clear_cache_success'))
    } catch (err) {
      showNotify($t('settings.other.clear_cache_failed', { msg: (err as Error).message }))
    }
  }
</script>

<TitleContent name={$t('settings.other.music_cache')}>
  <div class="settings-item-content">
    <div class="gap-top">
      <p class="p">
        {$t('settings.other.music_url_cache')}{musicUrlCacheSize}
        {#if musicUrlCacheSize}
          <Btn min onclick={() => handleClear(clearMusicUrl, { set: (v) => musicUrlCacheSize = v })}>{$t('settings.other.clear_music_url_cache')}</Btn>
        {/if}
      </p>
      <p class="p">
        {$t('settings.other.music_lyric_cache')}{musicLyricCacheSize}
        {#if musicLyricCacheSize}
          <Btn min onclick={() => handleClear(clearMusicLyric, { set: (v) => musicLyricCacheSize = v })}>{$t('settings.other.clear_music_lyric_cache')}</Btn>
        {/if}
      </p>
      <p class="p">
        {$t('settings.other.quality_label_cache')}{qualityLabelSize}
        {#if qualityLabelSize}
          <Btn min onclick={() => { clearAllQualities(); qualityLabelSize = 0; showNotify($t('settings.other.clear_cache_success')) }}>{$t('settings.other.clear_quality_label_cache')}</Btn>
        {/if}
      </p>
      <p class="p">
        {$t('settings.other.song_meta_cache')}{songMetaCacheSize}
        {#if songMetaCacheSize}
          <Btn min onclick={() => { clearAllMeta(); songMetaCacheSize = 0; showNotify($t('settings.other.clear_cache_success')) }}>{$t('settings.other.clear_song_meta_cache')}</Btn>
        {/if}
      </p>
      <p class="p">
        {$t('settings.other.music_other_source_cache')}{otherSourceSize}
        {#if otherSourceSize}
          <Btn min onclick={() => handleClear(clearMusicOtherSource, { set: (v) => otherSourceSize = v })}>{$t('settings.other.clear_music_other_source_cache')}</Btn>
        {/if}
      </p>
      <p class="p">
        {$t('settings.other.play_count_cache')}{playCountSize}
        {#if playCountSize}
          <Btn min onclick={() => handleClear(clearPlayCount, { set: (v) => playCountSize = v })}>{$t('settings.other.clear_play_count_cache')}</Btn>
        {/if}
      </p>
      <p class="p">
        {$t('settings.other.download_list_cache')}{downloadListSize}
        {#if downloadListSize}
          <Btn min onclick={() => handleClear(clearDownloadList, { set: (v) => downloadListSize = v })}>{$t('settings.other.clear_download_list_cache')}</Btn>
        {/if}
      </p>
      <p class="p clear-all">
        <Btn disabled={!musicUrlCacheSize && !musicLyricCacheSize && !qualityLabelSize && !songMetaCacheSize && !otherSourceSize && !playCountSize && !downloadListSize} onclick={handleClearAll}>
          {$t('settings.other.clear_all_cache')}
        </Btn>
      </p>
    </div>
  </div>
</TitleContent>

<style lang="less">
  .clear-all {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid var(--color-border);
  }
</style>
