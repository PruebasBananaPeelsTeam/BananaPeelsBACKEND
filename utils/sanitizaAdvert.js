export function sanitizeAdvert(advert, currentUserId = null) {
  const advertObj = advert.toObject ? advert.toObject() : { ...advert };

  // Asegurar que `owner` (username) exista
  advertObj.owner = advertObj.owner || advertObj.ownerId?.username || 'unknown';

  // Marcar si el usuario autenticado es el propietario
  if (currentUserId && advertObj.ownerId?._id?.toString) {
    advertObj.isOwnedByCurrentUser = advertObj.ownerId._id.toString() === currentUserId.toString();
  }

  // Eliminar ownerId
  delete advertObj.ownerId;

  return advertObj;
}
