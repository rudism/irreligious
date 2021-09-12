## Initial Game Progression Plan

### Phase 1: 0-1K Followers

- confined to compounds
  - build compound structures
    - [x] tents (+follower cap)
    - [x] houses (+follower cap)
    - [x] churches (+pastor cap)
  - [x] hire pastors to recruit and gather tithes (+money, +followers)
  - [ ] hire compound managers to auto-build (+tents, +houses, +churches)
  - [ ] fluctuating crypto market value passive determines crypto value
  - [ ] prosperity gospel policy increases tithes, decreases recruitment rate
  - main resource problems:
    - [x] lose money on purchases
    - [x] lose money for salaries
    - [ ] lose money for compound maintenance
    - [x] gain money from tithes
    - [x] low credibility loses followers
    - [ ] low and decreasing money loses jobs
    - [ ] gain or lose money on crypto based on market passive

### Phase 2: 1K-100K Followers

- establish presence in city
  - [x] unlocked by building permit
  - [ ] unlocks education influence passive
  - [ ] unlocks political influence passive
  - [ ] unlocks notoriety passive
  - build city structures
    - [x] megachurches (+pastor cap)
    - [ ] schools (+teachers cap)
    - [ ] colleges (+professors cap)
    - [ ] housing co-ops (+follower cap)
    - [ ] apartment buildings (+follower cap)
    - [ ] office buildings (+politician cap, +city planner cap, +hiring manager cap)
    - [ ] datacenters (+crypto miner cap, +crypto broker cap)
  - [ ] hire city planners to auto-build (+megachurches, +housing co-ops, +apartment buildings, +office buildings)
  - [ ] hire teachers and professors (+education, +education cap, +followers)
  - [ ] hire crypto miners (+crypto)
  - [ ] hire crypto brokers to buy and sell faithcoin at a profit (+- crypto, +-money)
  - [ ] hire hackers to steal faithcoin and improve broker performance (+crypto, +notoriety)
  - [ ] hire politicians to increase political influence (+politics, +politics cap)
  - [ ] hire hiring managers to auto-fill job slots as they become available
- political influence system
  - [ ] credibility goes up and notoriety goes down with higher political influence
  - [ ] unlock religious law tech
    - [ ] unlock fanaticism passive
    - build political structures
      - [ ] re-education camps (+notoriety, +religious police cap)
      - [ ] hire religious police to imprison non-followers and release them as followers over time (+fanaticism, +notoriety, +followers)
      - [ ] grass-roots campaigns, with chance to fail (+politician cap)
      - [ ] hire political strategists to automatically launch campaigns (+grass-roots campaigns, +politicians)
- notoriety system
  - [ ] hurts all recruitment efforts across the board
  - [ ] high notoriety ratio can cause some actions to randomly fail, hurts political campaigns
  - disables certain resources? (TBD)
- fanaticism system
  - [ ] each follower gained via certain methods increases fanaticism
  - [ ] fanatics are the last ones to leave when losing followers, lose at a much slower rate
  - unlocks fanatical abilities? (TBD)
- education influence system
  - [ ] improves success rate of political campaigns
  - [ ] suppress science policy causes some teacher/professor recruits to be fanatics (+fanaticism, +notoriety)
  - build educational structures
    - [ ] textbook publisher improves performance of teachers and professors (+education)

### Phase 3: 100K-??? Followers

- city states
  - purchase entire cities
  - work toward taking over the whole country

### Phase 4 and Beyond

- grow into more countries, consume entire world population
- build interstellar tech? xenotheology?

## Short-Term Todos

- [ ] add `disabledHint` to `userActions` to generate hint about how to enable an action
- [x] add an action to sell purchasables and regain some portion of their cost
- [ ] add a `policy` resource type that can be toggled on or off
- [x] remove recruitment effects of credibility (that will be for notoriety instead)
- [ ] change `value` to a getter that does `Math.floor` if it's a whole number resource

## Long-Term Ideas

- birth rates and death rates per religion
- religious war action per religion
  - send fanatics to capture and put people from that religion in re-education camps
- islands (like compounds but bigger)
- countries
- marketing system
  - billboards, newspaper, internet ads, radio ads, tv ads to boost recruitment, reduce notoriety
  - buy entire radio stations, tv stations, newspapers
  - buy entire ISPs and tv networks
  - reporter job
  - marketing manager job
