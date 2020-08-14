import dayjs from 'dayjs'

import { __test_only_initDayForecast__ as initDayForecast } from './'

it('empty result from empty array', () => {
  expect(initDayForecast([])).toEqual([])
})

it('single probe for sinle day', () => {
  const probe1 = {
    datetime: dayjs('01-01-2020'),
    temp: 10
  }
  const probe2 = {
    datetime: dayjs('01-02-2020'),
    temp: 11
  }
  const probe3 = {
    datetime: dayjs('01-03-2020'),
    temp: 12
  }
  const days = initDayForecast([probe1, probe2, probe3])

  expect(days.map(day => day.getProbes())).toEqual([
    [probe1],
    [probe2],
    [probe3]
  ])

  expect(days.map(day => day.getAverageTemp())).toEqual([10, 11, 12])
  expect(days.map(day => day.getDate())).toEqual([
    dayjs('01-01-2020'),
    dayjs('01-02-2020'),
    dayjs('01-03-2020')
  ])
})

it('multipe probes', () => {
  const probe1 = {
    datetime: dayjs('01-01-2020'),
    temp: 10
  }
  const probe2 = {
    datetime: dayjs('01-01-2020'),
    temp: 11
  }
  const probe3 = {
    datetime: dayjs('01-02-2020'),
    temp: 12
  }
  const probe4 = {
    datetime: dayjs('01-02-2020'),
    temp: 13
  }
  const probe5 = {
    datetime: dayjs('01-02-2020'),
    temp: 14
  }
  const probe6 = {
    datetime: dayjs('01-02-2020'),
    temp: 15
  }
  const probe7 = {
    datetime: dayjs('01-03-2020'),
    temp: 16.12
  }
  const probe8 = {
    datetime: dayjs('01-03-2020'),
    temp: 17.34
  }
  const probe9 = {
    datetime: dayjs('01-03-2020'),
    temp: 18.76
  }
  const days = initDayForecast([
    probe1,
    probe2,
    probe3,
    probe4,
    probe5,
    probe6,
    probe7,
    probe8,
    probe9
  ])

  expect(days.map(day => day.getProbes())).toEqual([
    [probe1, probe2],
    [probe3, probe4, probe5, probe6],
    [probe7, probe8, probe9]
  ])

  expect(days.map(day => day.getAverageTemp())).toEqual([10.5, 13.5, 17.41])
  expect(days.map(day => day.getDate())).toEqual([
    dayjs('01-01-2020'),
    dayjs('01-02-2020'),
    dayjs('01-03-2020')
  ])
})
