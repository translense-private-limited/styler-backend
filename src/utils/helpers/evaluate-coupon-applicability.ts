import { CouponInterface } from '@modules/coupons/interfaces/coupon.interface';

export const evaluateCouponApplicability = (coupon: CouponInterface, totalPrice: number): number => {
    let discountAmount = 0;

    if (coupon.discountType === 'PERCENTAGE') {
        discountAmount = (totalPrice * coupon.discountValue) / 100;
        if (coupon.maximumDiscountCapping) {
            discountAmount = Math.min(discountAmount, coupon.maximumDiscountCapping);
        }
    } else {
        discountAmount = coupon.discountValue;
    }

    return discountAmount;
};
