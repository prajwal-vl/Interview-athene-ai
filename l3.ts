// buggy_immutable.ts - CORRECTED VERSION (immutable)

interface CartItem {
  id: string
  quantity: number
  price: number
}

interface Cart {
  items: CartItem[]
  total: number
}

// Bug fix: completely immutable - returns new object, doesn't mutate inputs
const addToCart = (cart: Cart, newItem: CartItem): Cart => {
  // Find if item exists
  const existingIndex = cart.items.findIndex(i => i.id === newItem.id)
  
  let newItems: CartItem[]
  
  if (existingIndex >= 0) {
    // Bug fix #1 & #2: create new array with updated quantity
    newItems = [...cart.items]
    newItems[existingIndex] = {
      ...newItems[existingIndex],
      quantity: newItems[existingIndex].quantity + newItem.quantity
    }
  } else {
    // Bug fix #3: add new item without mutating
    newItems = [...cart.items, newItem]
  }
  
  // Bug fix #4: recalculate total
  const newTotal = newItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)
  
  // Return brand new Cart object
  return { items: newItems, total: newTotal }
}

// Test case - now works correctly
const myCart: Cart = { items: [], total: 0 }
const cartA = addToCart(myCart, { id: "a", quantity: 1, price: 10 })
const cartB = addToCart(cartA, { id: "a", quantity: 2, price: 10 })

console.log(cartA.total)  // ✅ 10
console.log(cartB.total)  // ✅ 30
console.log(myCart)       // ✅ { items: [], total: 0 } - unchanged