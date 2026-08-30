import {expect, test} from '@playwright/test';

test.describe('Deck end-to-end interactions', () => {
  test.beforeEach(async ({page}) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 24px;
              background-color: #0f172a;
              font-family: sans-serif;
            }
            .deck-zone {
              display: inline-block;
              width: 100px;
              height: 140px;
              border: 2px solid #334155;
              border-radius: 8px;
              background-color: #1e293b;
            }
            .card-face {
              width: 100px;
              height: 140px;
              border-radius: 8px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              box-sizing: border-box;
              border: 2px solid #cbd5e1;
              background-color: #ffffff;
              color: #0f172a;
            }
            .card-red {
              color: #dc2626;
            }
            .card-back {
              background-color: #1e40af;
              border-color: #3b82f6;
              color: #93c5fd;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div id="deck-wrapper">
            <pb-deck id="test-deck" name="Draw Pile" class="deck-zone">
              <pb-d2 id="card-hearts" name="Ace of Hearts">
                <div slot="face0" class="card-face card-red">A ♥</div>
                <div slot="face1" class="card-face card-back">BACK</div>
              </pb-d2>
              <pb-d2 id="card-spades" name="King of Spades">
                <div slot="face0" class="card-face">K ♠</div>
                <div slot="face1" class="card-face card-back">BACK</div>
              </pb-d2>
            </pb-deck>
          </div>
          <pb-hand-overlay></pb-hand-overlay>
          <pb-action-popup id="test-popup"></pb-action-popup>
        </body>
      </html>
    `);
    await page.addScriptTag({path: 'dist/protoboard.min.js'});
    await page.evaluate(() => {
      window.Protoboard.initialize();
    });
  });

  test('renders stacked deck with top card visible and matches visual snapshot', async ({
    page,
  }) => {
    const deck = page.locator('#test-deck');
    await expect(deck).toHaveScreenshot('deck_e2e-initial.png');
  });

  test('draws top card on hover and c keypress and matches visual snapshot', async ({
    page,
  }) => {
    const topCard = page.locator('#card-spades');
    await topCard.hover();
    await page.keyboard.press('c');

    await page.mouse.move(100, 250);
    await expect(page).toHaveScreenshot('deck_e2e-picked.png');
  });

  test('flips entire deck on f keypress and matches visual snapshot', async ({
    page,
  }) => {
    const deck = page.locator('#test-deck');
    await deck.hover();
    await page.keyboard.press('f');

    await expect(deck).toHaveScreenshot('deck_e2e-flipped.png');
  });

  test('renders action popup on ? keypress showing aggregated deck actions', async ({
    page,
  }) => {
    const deck = page.locator('#test-deck');
    await deck.hover();
    await page.keyboard.press('?');

    const popup = page.locator('#test-popup .popup');
    await expect(popup).toBeVisible();

    await expect(page).toHaveScreenshot('deck_e2e-popup.png');
  });

  test('drops held card onto deck on Space keypress', async ({page}) => {
    const topCard = page.locator('#card-spades');
    await topCard.hover();
    await page.keyboard.press('c');

    const overlay = page.locator('pb-hand-overlay');
    await expect(overlay.locator('#card-spades')).toBeAttached();

    const deck = page.locator('#test-deck');
    await deck.hover();
    await page.keyboard.press('Space');

    await expect(overlay.locator('#card-spades')).not.toBeAttached();
    const lastChildId = await page.evaluate(() => {
      const el = document.querySelector('#test-deck')!;
      return el.lastElementChild!.id;
    });
    expect(lastChildId).toBe('card-spades');
  });

  test('picks all cards into hand overlay on Shift+C keypress', async ({
    page,
  }) => {
    const deck = page.locator('#test-deck');
    await deck.hover();
    await page.keyboard.press('Shift+C');

    const overlay = page.locator('pb-hand-overlay');
    await expect(overlay.locator('#card-hearts')).toBeAttached();
    await expect(overlay.locator('#card-spades')).toBeAttached();

    const childCount = await page.evaluate(() => {
      const el = document.querySelector('#test-deck')!;
      return el.children.length;
    });
    expect(childCount).toBe(0);
  });
});
