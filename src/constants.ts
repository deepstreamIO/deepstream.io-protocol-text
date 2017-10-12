export const MESSAGE_SEPERATOR = String.fromCharCode(30) // ASCII Record Seperator 1E
export const MESSAGE_PART_SEPERATOR = String.fromCharCode(31) // ASCII Unit Separator 1F

export const TOPIC = {
	CONNECTION: { TEXT: 'C', BYTE: 0x00 },
	AUTH: { TEXT: 'A', BYTE: 0x01 },
	ERROR: { TEXT: 'X', BYTE: 0x02 },
	EVENT: { TEXT: 'E', BYTE: 0x03 },
	RECORD: { TEXT: 'R', BYTE: 0x05 },
	RPC: { TEXT: 'P', BYTE: 0x06 },
	PRESENCE: { TEXT: 'U', BYTE: 0x07 }
}

export const CONNECTION_ACTIONS = {
	ERROR: { TEXT: 'E', BYTE: 0x00 },
	PING: { TEXT: 'PI', BYTE: 0x01 },
	PONG: { TEXT: 'PO', BYTE: 0x02 },
	ACCEPT: { TEXT: 'A', BYTE: 0x03 },
	CHALLENGE: { TEXT: 'CH', BYTE: 0x04 },
	CHALLENGE_RESPONSE: { TEXT: 'CHR', BYTE: 0x05 },
	REJECTION: { TEXT: 'REJ', BYTE: 0x06 },
	REDIRECT: { TEXT: 'RED', BYTE: 0x07 }
}

export const AUTH_ACTIONS = {
	ERROR: { TEXT: 'E', BYTE: 0x00 },
	REQUEST: { TEXT: 'REQ', BYTE: 0x01 },
	AUTH_SUCCESFUL: { BYTE: 0x02 },
	INVALID_AUTH_DATA: { BYTE: 0x03 },
	TOO_MANY_AUTH_ATTEMPTS: { BYTE: 0x04 }
}

export const EVENT_ACTIONS = {
	ERROR: { TEXT: 'E', BYTE: 0x00 },
	EMIT: { TEXT: 'EVT', BYTE: 0x01 },
	SUBSCRIBE: { TEXT: 'S', BYTE: 0x02 },
	SUBSCRIBE_ACK: { BYTE: 0x03 },
	UNSUBSCRIBE: { TEXT: 'US', BYTE: 0x04 },
	UNSUBSCRIBE_ACK: { BYTE: 0x05 },
	LISTEN: { TEXT: 'L', BYTE: 0x06 },
	LISTEN_ACK: { BYTE: 0x07 },
	UNLISTEN: { TEXT: 'UL', BYTE: 0x08 },
	UNLISTEN_ACK: { BYTE: 0x09 },
	LISTEN_ACCEPT: { TEXT: 'LA', BYTE: 0x0A },
	LISTEN_REJECT: { TEXT: 'LR', BYTE: 0x0B },
	SUBSCRIPTION_FOR_PATTERN_FOUND: { TEXT: 'SP', BYTE: 0x0C },
	SUBSCRIPTION_FOR_PATTERN_REMOVED: { TEXT: 'SR', BYTE: 0x0D }
}

export const RECORD_ACTIONS = {
	ERROR: { TEXT: 'E', BYTE: 0x00 },
	CREATE: { TEXT: 'CR', BYTE: 0x01 },
	READ: { TEXT: 'R', BYTE: 0x02 },
	READ_RESPONSE: { BYTE: 0x03 },
	HEAD: { TEXT: 'HD', BYTE: 0x04 },
	HEAD_RESPONSE: { BYTE: 0x05 },
	CREATEANDUPDATE: { TEXT: 'CU', BYTE: 0x06 },
	CREATEANDUPDATE_WITH_WRITE_ACK: { BYTE: 0x07 },
	CREATEANDPATCH: { BYTE: 0x08 },
	CREATEANDPATCH_WITH_WRITE_ACK: { BYTE: 0x09 },
	UPDATE: { TEXT: 'U', BYTE: 0x0A },
	UPDATE_WITH_WRITE_ACK: { BYTE: 0x0B },
	PATCH: { TEXT: 'P', BYTE: 0x0C },
	PATCH_WITH_WRITE_ACK: { BYTE: 0x0D },
	ERASE: { BYTE: 0x0E },
	ERASE_WITH_WRITE_ACK: { BYTE: 0x0F },
	WRITE_ACKNOWLEDGEMENT: { TEXT: 'WA', BYTE: 0x10 },
	DELETE: { TEXT: 'D', BYTE: 0x11 },
	DELETE_ACK: { BYTE: 0x12 },
	DELETED: { BYTE: 0x13 },

	SUBSCRIBEANDHEAD: { BYTE: 0x20 },
	SUBSCRIBEANDHEAD_RESPONSE: { BYTE: 0x21 },
	SUBSCRIBEANDREAD: { BYTE: 0x22 },
	SUBSCRIBEANDREAD_RESPONSE: { BYTE: 0x23 },
	SUBSCRIBECREATEANDREAD: { TEXT: 'CR', BYTE: 0x24 },
	SUBSCRIBECREATEANDREAD_RESPONSE: { BYTE: 0x25 },
	SUBSCRIBECREATEANDUPDATE: { BYTE: 0x26 },
	SUBSCRIBECREATEANDUPDATE_RESPONSE: { BYTE: 0x27 },
	SUBSCRIBE: { BYTE: 0x28 },
	SUBSCRIBE_ACK: { ACK: true, BYTE: 0x29 },
	UNSUBSCRIBE: { TEXT: 'US', BYTE: 0x2A },
	UNSUBSCRIBE_ACK: { BYTE: 0x2B },

	LISTEN: { TEXT: 'L', BYTE: 0x30 },
	LISTEN_ACK: { BYTE: 0x31 },
	UNLISTEN: { TEXT: 'UL', BYTE: 0x32 },
	UNLISTEN_ACK: { BYTE: 0x33 },
	LISTEN_ACCEPT: { TEXT: 'LA', BYTE: 0x34 },
	LISTEN_REJECT: { TEXT: 'LR', BYTE: 0x35 },
	SUBSCRIPTION_HAS_PROVIDER: { TEXT: 'SH', BYTE: 0x36 },
	SUBSCRIPTION_HAS_NO_PROVIDER: { BYTE: 0x37 },
	SUBSCRIPTION_FOR_PATTERN_FOUND: { TEXT: 'SP', BYTE: 0x38 },
	SUBSCRIPTION_FOR_PATTERN_REMOVED: { TEXT: 'SR', BYTE: 0x39 },
	
	CACHE_RETRIEVAL_TIMEOUT: { TEXT: 'CRWA', BYTE: 0x40 },
	STORAGE_RETRIEVAL_TIMEOUT: { TEXT: 'CRWA', BYTE: 0x41 },
	VERSION_EXISTS: { TEXT: 'CRWA', BYTE: 0x42 },
	
	HAS: { TEXT: 'CRWA', BYTE: 0xF0 },
	HAS_RESPONSE: { TEXT: 'CRWA', BYTE: 0xF1 },
	SNAPSHOT: { TEXT: 'SN', BYTE: 0xF2 }
}

export const RPC_ACTIONS = {
	ERROR: { BYTE: 0x00 },
	REQUEST: { TEXT: 'REQ', BYTE: 0x01 },
	ACCEPT: { BYTE: 0x02 },
	RESPONSE: { TEXT: 'RES', BYTE: 0x03 },
	REJECT: { TEXT: 'REJ', BYTE: 0x04 },
	REQUEST_ERROR: { TEXT: 'E', BYTE: 0x05 },
	PROVIDE: { TEXT: 'S', BYTE: 0x06 },
	PROVIDE_ACK: { BYTE: 0x07 },
	UNPROVIDE: { TEXT: 'US', BYTE: 0x08 },
	UNPROVIDE_ACK: { BYTE: 0x09 },
	NO_RPC_PROVIDER: { BYTE: 0x0A },
	RPC_TIMEOUT: { BYTE: 0x0B },
	ACCEPT_TIMEOUT: { BYTE: 0x0C }
}

export const PRESENCE_ACTIONS = {
	ERROR: { TEXT: 'E', BYTE: 0x00 },
	QUERY_ALL: { BYTE: 0x01 },
	QUERY_ALL_RESPONSE: { BYTE: 0x02 },
	QUERY: { TEXT: 'Q', BYTE: 0x03 },
	QUERY_RESPONSE: { BYTE: 0x04 },
	PRESENCE_JOIN: { TEXT: 'PNJ', BYTE: 0x05 },
	PRESENCE_LEAVE: { TEXT: 'PNL', BYTE: 0x06 },
	SUBSCRIBE: { TEXT: 'S', BYTE: 0x07 },
	SUBSCRIBE_ACK: { BYTE: 0x08 },
	UNSUBSCRIBE: { TEXT: 'US', BYTE: 0x09 },
	UNSUBSCRIBE_ACK: { BYTE: 0x10 }
}

export const PAYLOAD_ENCODING = {
	JSON: 0x00,
	DEEPSTREAM: 0x01
}

export const DEEPSTREAM_TYPES = {
	STRING: 'S',
	OBJECT: 'O',
	NUMBER: 'N',
	NULL: 'L',
	TRUE: 'T',
	FALSE: 'F',
	UNDEFINED: 'U'
}

export const TOPIC_BYTE_TO_TEXT = convertMap(TOPIC, 'BYTE', 'TEXT')
export const TOPIC_TEXT_TO_BYTE = convertMap(TOPIC, 'TEXT', 'BYTE')
export const TOPIC_TEXT_TO_KEY = reverseMap(specifyMap(TOPIC, 'TEXT'))
export const TOPIC_BYTE_TO_KEY = reverseMap(specifyMap(TOPIC, 'BYTE'))
export const TOPIC_BYTES = specifyMap(TOPIC, 'BYTE')

export const ACTIONS_BYTE_TO_TEXT = {}
export const ACTIONS_TEXT_TO_BYTE = {}
export const ACTIONS_BYTES = {}
export const ACTIONS_TEXT_TO_KEY = {}
export const ACTIONS_BYTE_TO_KEY = {}

export const ACTIONS = {
	[TOPIC.CONNECTION.BYTE]: CONNECTION_ACTIONS,
	[TOPIC.AUTH.BYTE]: AUTH_ACTIONS,
	[TOPIC.EVENT.BYTE]: EVENT_ACTIONS,
	[TOPIC.RECORD.BYTE]: RECORD_ACTIONS,
	[TOPIC.RPC.BYTE]: RPC_ACTIONS,
	[TOPIC.PRESENCE.BYTE]: PRESENCE_ACTIONS
}

for (const key in ACTIONS) {
	ACTIONS_BYTE_TO_TEXT[key] = convertMap(ACTIONS[key], 'BYTE', 'TEXT')
	ACTIONS_TEXT_TO_BYTE[key] = convertMap(ACTIONS[key], 'TEXT', 'BYTE')
	ACTIONS_BYTES[key] = specifyMap(ACTIONS[key], 'BYTE')
	ACTIONS_TEXT_TO_KEY[key] = reverseMap(specifyMap(ACTIONS[key], 'TEXT'))
	ACTIONS_BYTE_TO_KEY[key] = reverseMap(specifyMap(ACTIONS[key], 'BYTE'))
}

/**
 * convertMap({ a: { x: 1 }, b: { x: 2 }, c: { x : 3 } }, 'x', 'y')
 *  ===
 * { a: { y: 1 }, b: { y: 2 }, c: { y : 3 } }
 */
function convertMap(map, from, to) {
	const result = {}

	for (const key in map) {
		result[map[key][from]] = map[key][to]
	}

	return result
}

/**
 * specifyMap({ a: { x: 1 }, b: { x: 2 }, c: { x : 3 } }, 'x')
 *  ===
 * { a: 1, b: 2, c: 3 }
 */
function specifyMap(map, innerKey) {
	const result = {}

	for (const key in map) {
		result[key] = map[key][innerKey]
	}

	return result
}

/**
 * Takes a key-value map and returns
 * a map with { value: key } of the old map
 */
function reverseMap(map) {
	const reversedMap = {}

	for (const key in map) {
		reversedMap[map[key]] = key
	}

	return reversedMap
}

