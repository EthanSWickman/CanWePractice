class UnitConverter {
    accepted_types

    // needs convert function, etc.
    
}

class SpeedConverter extends UnitConverter{

}

export function MphToKnots(mph) {
    mph = mph * 0.868976 * 10
    return Math.round(mph) / 10
}

export function convert
