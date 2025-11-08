import { computed } from '@angular/core';
import { signalStore, withComputed, withMethods, patchState, withState } from '@ngrx/signals';
import { PLAYER } from './character-queue/character-queue.store';

export interface GameMessage {
	characterId: typeof PLAYER | number;
	text: string;
	styleObject?: { [key: string]: string };
    action?: () => void;
}

type MessageState = {
	messages: GameMessage[];
};

const initialState: MessageState = {
	messages: [],
};

export const MessageStore = signalStore(
	{ providedIn: 'root' },
	withState(initialState),
	withComputed((store) => ({
		/** A computed signal for the currently active message. */
		currentMessage: computed(() => store.messages()[0]),
	})),
	withMethods((store) => ({
		addMessage(message: GameMessage) {
			patchState(store, (state) => ({ messages: [...state.messages, message] }));
		},
		popMessage(): GameMessage | undefined {
			const messageToReturn = store.messages()[0];
			if (messageToReturn) {
				patchState(store, (state) => ({ messages: state.messages.slice(1) }));

                // Call the action of the next message, if it was provided
                store.currentMessage()?.action?.();
			}
			return messageToReturn;
		},
	}))
);