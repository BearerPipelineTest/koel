<template>
  <article
    v-if="showing"
    :class="layout"
    :title="`${album.name} by ${album.artist_name}`"
    class="item"
    data-testid="album-card"
    draggable="true"
    tabindex="0"
    @dblclick="shuffle"
    @dragstart="dragStart"
    @contextmenu.prevent="requestContextMenu"
  >
    <AlbumThumbnail :entity="album"/>

    <footer>
      <a :href="`#!/album/${album.id}`" class="name" data-testid="name">{{ album.name }}</a>
      <a v-if="isStandardArtist" :href="`#!/artist/${album.artist_id}`" class="artist">{{ album.artist_name }}</a>
      <span v-else class="text-secondary">{{ album.artist_name }}</span>
      <p class="meta">
        <span class="left">
          {{ pluralize(album.song_count, 'song') }}
          •
          {{ duration }}
          •
          {{ pluralize(album.play_count, 'play') }}
        </span>
        <span class="right">
          <a
            :title="`Shuffle all songs in the album ${album.name}`"
            class="shuffle-album"
            data-testid="shuffle-album"
            href
            role="button"
            @click.prevent="shuffle"
          >
            <icon :icon="faRandom"/>
          </a>
          <a
            v-if="allowDownload"
            :title="`Download all songs in the album ${album.name}`"
            class="download-album"
            data-testid="download-album"
            href
            role="button"
            @click.prevent="download"
          >
            <icon :icon="faDownload"/>
          </a>
        </span>
      </p>
    </footer>
  </article>
</template>

<script lang="ts" setup>
import { faDownload, faRandom } from '@fortawesome/free-solid-svg-icons'
import { computed, toRef, toRefs } from 'vue'
import { eventBus, pluralize, secondsToHis, startDragging } from '@/utils'
import { albumStore, artistStore, commonStore, songStore } from '@/stores'
import { downloadService, playbackService } from '@/services'

import AlbumThumbnail from '@/components/ui/AlbumArtistThumbnail.vue'

const props = withDefaults(defineProps<{ album: Album, layout?: ArtistAlbumCardLayout }>(), { layout: 'full' })
const { album, layout } = toRefs(props)

const allowDownload = toRef(commonStore.state, 'allow_download')

const duration = computed(() => secondsToHis(album.value.length))
const isStandardArtist = computed(() => artistStore.isStandard(album.value.artist_id))
const showing = computed(() => !albumStore.isUnknown(album.value))

const shuffle = async () => {
  await playbackService.queueAndPlay(await songStore.fetchForAlbum(album.value), true /* shuffled */)
}

const download = () => downloadService.fromAlbum(album.value)
const dragStart = (event: DragEvent) => startDragging(event, album.value, 'Album')
const requestContextMenu = (event: MouseEvent) => eventBus.emit('ALBUM_CONTEXT_MENU_REQUESTED', event, album.value)
</script>

<style lang="scss">
@include artist-album-card();
</style>
