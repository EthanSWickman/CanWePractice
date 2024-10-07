export function ConvertSpeed(unit1, unit2, val) {
    const comparisonMap = {
        'mph': 1,
        'kmph': 1.60934,
        'knots': 0.868976
    }

    return (comparisonMap[unit2] / comparisonMap[unit1]) * val 
}

export function ConvertDistance(unit1, unit2, val) {
    const comparisonMap = {
        'mi': 1,
        'km': 1.60934
    }

    return (comparisonMap[unit2] / comparisonMap[unit1]) * val 
}

export function ConvertTemperature(unit1, unit2, val) {
    if (unit1 == 'celsius' && unit2 == 'fahrenheit') {
        return (val / (5/9)) + 32
    }
    else if (unit1 == 'fahrenheit' && unit2 == 'celsius') {
        return (val - 32) * (5/9)
    }
    else return val
}

export function ConvertDirection(unit1, unit2, val) {
    const comparisonMap = {
        'N': 0,
        'NE': 45,
        'E': 90,
        'SE': 135,
        'S': 180,
        'SW': 225,
        'W': 270,
        'NW': 315,
    }

    val = val % 360

    if (unit1 == 'point' && unit2 == 'degrees') {
        return comparisonMap[unit1]
    }

    else if (unit1 == 'degrees' && unit2 == 'point') {
        val += 22.5
        val = val % 360

        switch (Math.floor(val / 45)) {
            case 0: return 'N'
            case 1: return 'NE'
            case 2: return 'E' 
            case 3: return 'SE'
            case 4: return 'S'
            case 5: return 'SW'
            case 6: return 'W'
            case 7: return 'NW'
        }
    }

    else return val
}