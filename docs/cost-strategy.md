# Cost Strategy: The Thrifty Protocol

To maximize the 100/month generation limit on 21st.dev, we adhere to the following strategy.

## 1. The "Inspiration First" Rule (Cost: 0)
Before generating *anything*, the agent must search the 21st.dev **Inspirations** library.
- These are community components that are **free** to assume.
- If a component matches 80% of the need, **use it**.
- Adapt it via code edits rather than re-generating from scratch.

## 2. The Logic Separation
- Use Magic MCP *only* for the Visual/React component.
- Do not waste a "Generation" asking it to write backend logic or business rules. Use standard coding for that.

## 3. Batching
- If you need a "Dashboard", ask for the *entire layout* in one generation, rather than generating "Sidebar", "Header", and "Card" separately (3 credits vs 1 credit).
