export default function MphToKnots(mph) {
    mph = mph * 0.868976 * 10
    return Math.round(mph) / 10
}