import { Action, Effect } from 'core'

import Either from 'frctl/Either'
import Decode, { Decoder } from 'frctl/Json/Decode'

export type Coordinates = {
  lat: number
  lon: number
}

const coordinatesDecoder: Decoder<Coordinates> = Decode.shape({
  lat: Decode.field('latitude').float,
  lon: Decode.field('longitude').float
})

export const getCurrentLocation = <A extends Action>(
  tagger: (result: Either<string, Coordinates>) => A
): Effect<A> => dispatch => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const result = Decode.field('coords')
          .of(coordinatesDecoder)
          .decode(position)
          .mapLeft(decodeError => decodeError.stringify(4))

        return dispatch(tagger(result))
      },
      () => dispatch(tagger(Either.Left('Unable to retrieve your location')))
    )
  } else {
    dispatch(
      tagger(Either.Left('Geolocation is not supported by your browser'))
    )
  }
}
