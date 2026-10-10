const PRODUCT_FIELDS = /* GraphQL */ `
  fragment ProductFields on Product {
    id handle title vendor productType description tags availableForSale
    featuredImage { url altText width height }
    priceRange { minVariantPrice { amount currencyCode } }
    variants(first: 1) { nodes { id availableForSale price { amount currencyCode } } }
  }
`;

const CART_FIELDS = /* GraphQL */ `
  fragment CartFields on Cart {
    id checkoutUrl totalQuantity
    cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
    lines(first: 100) { nodes {
      id quantity
      merchandise { ... on ProductVariant {
        id title price { amount currencyCode }
        product { handle title vendor featuredImage { url altText } }
      } }
    } }
  }
`;

export const PRODUCTS_QUERY = `${PRODUCT_FIELDS}
  query Products($first: Int!, $query: String) { products(first: $first, query: $query) { nodes { ...ProductFields } } }`;

export const PRODUCT_BY_HANDLE_QUERY = `${PRODUCT_FIELDS}
  query Product($handle: String!) { product(handle: $handle) { ...ProductFields } }`;

export const COLLECTION_QUERY = `${PRODUCT_FIELDS}
  query Collection($handle: String!, $first: Int!) { collection(handle: $handle) { title description products(first: $first) { nodes { ...ProductFields } } } }`;

export const CART_CREATE = `${CART_FIELDS}
  mutation CartCreate($lines: [CartLineInput!]) { cartCreate(input: { lines: $lines }) { cart { ...CartFields } userErrors { message } } }`;

export const CART_QUERY = `${CART_FIELDS}
  query Cart($id: ID!) { cart(id: $id) { ...CartFields } }`;

export const CART_LINES_ADD = `${CART_FIELDS}
  mutation Add($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { message } } }`;

export const CART_LINES_UPDATE = `${CART_FIELDS}
  mutation Update($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { message } } }`;

export const CART_LINES_REMOVE = `${CART_FIELDS}
  mutation Remove($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } userErrors { message } } }`;
