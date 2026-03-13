
import { loadAction } from '../../state/LoadAction'
import groupsSlice from './groupSlice'
import { describe, it, expect } from 'vitest'

const reducer = groupsSlice.reducer

const groupAllSquid = {
  id: "69b07c8bbf6670bf7ed7ea51",
  users: ["69b07bd7bf6670bf7ed7ea4f", "69ab139aa2b62ef31bbbef64"],
  name: "AllSquid"
}

const groupTopOfTheCharts = {
  id: "69b2db3a51f23bf7ab866fdc",
  users: ["69b07bd7bf6670bf7ed7ea4f"],
  name: "Top of the Charts"
}

const groupAllSquidUpdated = {
  ...groupAllSquid,
  name: "AllSquid Updated",
  users: [...groupAllSquid.users, "69ab139aa2b62ef31bbbef99"]
}

describe('groupsSlice', () => {
  it('starts with empty state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual([])
  })

  it('loads groups from ACLoad', () => {
    const nextState = reducer([], loadAction({ groups: [groupAllSquid, groupTopOfTheCharts] }))
    expect(nextState).toHaveLength(2)
    expect(nextState[0].name).toBe('AllSquid')
    expect(nextState[1].name).toBe('Top of the Charts')
  })

  it('preserves group users array on load', () => {
    const nextState = reducer([], loadAction({ groups: [groupAllSquid] }))
    expect(nextState[0].users).toHaveLength(2)
    expect(nextState[0].users).toContain("69b07bd7bf6670bf7ed7ea4f")
  })

  it('appends new group without removing existing', () => {
    const nextState = reducer([groupAllSquid], loadAction({ groups: [groupTopOfTheCharts] }))
    expect(nextState).toHaveLength(2)
    expect(nextState.map(g => g.id)).toContain(groupAllSquid.id)
    expect(nextState.map(g => g.id)).toContain(groupTopOfTheCharts.id)
  })

  it('updates existing group by id', () => {
    const nextState = reducer([groupAllSquid], loadAction({ groups: [groupAllSquidUpdated] }))
    expect(nextState).toHaveLength(1)
    expect(nextState[0].name).toBe('AllSquid Updated')
    expect(nextState[0].users).toHaveLength(3)
  })

  it('does not clear groups when ACLoad has no groups', () => {
    const nextState = reducer([groupAllSquid], loadAction({ users: [] }))
    expect(nextState).toHaveLength(1)
    expect(nextState[0].id).toBe(groupAllSquid.id)
  })

  it('does not clear groups when ACLoad groups is empty array', () => {
    const nextState = reducer([groupAllSquid], loadAction({ groups: [] }))
    expect(nextState).toHaveLength(1)
    expect(nextState[0].id).toBe(groupAllSquid.id)
  })
})