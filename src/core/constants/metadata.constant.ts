// src/core/constants/metadata.constant.ts
export const METADATA_KEY = {
  IS_PUBLIC: 'isPublic',
  ROLES: 'roles',
  PERMISSIONS: 'permissions',
  CACHE_TTL: 'cache_ttl',
  API_TAG: {
    AUTH: 'AUTH',
    STAFF: 'STAFF',
    USER: 'USER',
    BOOKING: 'BOOKING',
    COURSE: 'COURSE',
    COMPANY: 'COMPANY',
    CUSTOMER: 'CUSTOMER',
    ROOM: 'ROOM',
    CHECK_IN: 'CHECK_IN',
    CHECK_OUT: 'CHECK_OUT',
    PAYMENT: 'PAYMENT',
    CANCELLATION: 'CANCELLATION',
  },
  CONTEXT: {
    REQUEST_ID: 'requestId',
    USER: 'user',
  },
  CACHE_KEY: {
    USER_PERMISSIONS: 'USER_PERMISSIONS',
    STAFF_LIST: 'STAFF_LIST',  
  },
  EVENTS: {
    USER_CREATED: 'user.created',
    STAFF_HIRED: 'staff.hired', 
  },
};