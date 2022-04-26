export const transformProductInCartAttributeKey = (
  product,
  newSize,
  oldKey,
  attributeName
) => {
  const oldKeyAttributes = oldKey?.split('?')[1].split('&');
  const newAttributes = oldKeyAttributes?.map((attributeParam) => {
    if (attributeParam.split('=')[0] === attributeName) {
      attributeParam = attributeName + '=' + newSize.value;
    }
    return attributeParam;
  });
  const newKey = product.id + '?' + newAttributes.join('&');

  return newKey;
};
