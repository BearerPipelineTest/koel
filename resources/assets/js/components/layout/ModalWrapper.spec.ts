import factory from '@/__tests__/factory'
import { eventBus } from '@/utils'
import { it } from 'vitest'
import { EventName } from '@/config'
import UnitTestCase from '@/__tests__/UnitTestCase'
import ModalWrapper from './ModalWrapper.vue'

new class extends UnitTestCase {
  protected test () {
    it.each<[string, EventName, User | Song | Playlist | any]>([
      ['add-user-form', 'MODAL_SHOW_ADD_USER_FORM', undefined],
      ['edit-user-form', 'MODAL_SHOW_EDIT_USER_FORM', factory('user')],
      ['edit-song-form', 'MODAL_SHOW_EDIT_SONG_FORM', [factory('song')]],
      ['create-smart-playlist-form', 'MODAL_SHOW_CREATE_SMART_PLAYLIST_FORM', undefined],
      ['edit-smart-playlist-form', 'MODAL_SHOW_EDIT_SMART_PLAYLIST_FORM', factory('playlist')],
      ['about-koel', 'MODAL_SHOW_ABOUT_KOEL', undefined]
    ])('shows %s modal', async (modalName: string, eventName: EventName, eventParams?: any) => {
      const { findByTestId } = this.render(ModalWrapper)

      eventBus.emit(eventName, eventParams)

      findByTestId(modalName)
    })
  }
}
