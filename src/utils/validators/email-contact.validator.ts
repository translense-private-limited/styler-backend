export function isEmail(username: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(username);
}

export function isContactNumber(username: string): boolean {
    const contactNumberPattern = /^\d{10}$/;
    return contactNumberPattern.test(username);
}
