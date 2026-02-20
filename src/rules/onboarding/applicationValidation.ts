export function validateApplication(input: any) {
  if (!input.description || input.description.length < 20) {
    throw new Error('Description too short');
  }

  if (input.type === 'shop' && !input.businessName) {
    throw new Error('Business name required for shop');
  }

  const allowedTypes = ['owner', 'shop'];
  if (!allowedTypes.includes(input.type)) {
    throw new Error('Invalid application type');
  }
}