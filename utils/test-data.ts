/**
 * Test data lives here, not inside the specs. Adding a new negative-login
 * case, for example, means adding a user below — no test file changes.
 */
export const users = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  lockedOut: { username: 'locked_out_user', password: 'secret_sauce' },
  problem: { username: 'problem_user', password: 'secret_sauce' },
};

export const checkoutInfo = {
  valid: { firstName: 'Anushree', lastName: 'Mohanty', postalCode: '560001' },
};

export const products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
  fleeceJacket: 'Sauce Labs Fleece Jacket',
};
