import {expect, test} from '@playwright/test';

test.describe('Slot end-to-end interactions', () => {
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
            .slot-board {
              display: block;
              width: 400px;
              height: 300px;
              background-color: #1e293b;
              border: 2px dashed #334155;
              border-radius: 8px;
              position: relative;
            }
            .token {
              width: 60px;
              height: 60px;
              background: linear-gradient(135deg, #0284c7, #0369a1);
              border: 2px solid #38bdf8;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 24px;
              color: #f8fafc;
              font-weight: bold;
            }
            .die {
              width: 60px;
              height: 60px;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 18px;
              background-color: #ef4444;
              border: 2px solid #f87171;
              color: #ffffff;
            }
          </style>
        </head>
        <body>
          <pb-slot id="board" name="Tabletop Slot" class="slot-board">
            <pb-d1
              id="piece-pawn"
              name="Blue Pawn"
              style="position: absolute; left: 30px; top: 30px;"
            >
              <div slot="face0" class="token">♟</div>
            </pb-d1>
            <pb-d6
              id="piece-die"
              name="Red D6"
              style="position: absolute; left: 120px; top: 30px;"
            >
              <div slot="face0" class="die">1</div>
              <div slot="face1" class="die">2</div>
              <div slot="face2" class="die">3</div>
              <div slot="face3" class="die">4</div>
              <div slot="face4" class="die">5</div>
              <div slot="face5" class="die">6</div>
            </pb-d6>
          </pb-slot>
          <pb-hand-overlay></pb-hand-overlay>
          <pb-action-popup id="popup"></pb-action-popup>
        </body>
      </html>
    `);
    await page.addScriptTag({path: 'dist/protoboard.min.js'});
    await page.evaluate(() => {
      window.Protoboard.initialize();
    });
  });

  test('renders slot container with positioned child pieces and matches visual snapshot', async ({
    page,
  }) => {
    const slot = page.locator('#board');
    await expect(slot).toHaveScreenshot('slot_e2e-initial.png');
  });

  test('drops picked piece at exact cursor location on Space and matches visual snapshot', async ({
    page,
  }) => {
    const pawn = page.locator('#piece-pawn');
    await pawn.hover();
    await page.keyboard.press('c');

    await page.mouse.move(240, 180);
    await page.keyboard.press('Space');

    const droppedPawn = page.locator('#board #piece-pawn');
    await expect(droppedPawn).toBeAttached();

    const positionStyle = await droppedPawn.evaluate((el: HTMLElement) => ({
      left: el.style.left,
      position: el.style.position,
      top: el.style.top,
    }));

    expect(positionStyle.position).toBe('absolute');
    expect(positionStyle.left).toBe('216px');
    expect(positionStyle.top).toBe('156px');

    const slot = page.locator('#board');
    await expect(slot).toHaveScreenshot('slot_e2e-dropped.png');
  });

  test('renders action popup with aggregated piece and slot actions', async ({
    page,
  }) => {
    const die = page.locator('#piece-die');
    await die.hover();
    await page.keyboard.press('?');

    const popup = page.locator('#popup .popup');
    await expect(popup).toBeVisible();

    await expect(page).toHaveScreenshot('slot_e2e-popup.png');
  });

  test('drops all held pieces at exact cursor location on Shift+Space', async ({
    page,
  }) => {
    const pawn = page.locator('#piece-pawn');
    await pawn.hover();
    await page.keyboard.press('c');

    const die = page.locator('#piece-die');
    await die.hover();
    await page.keyboard.press('c');

    await page.mouse.move(250, 150);
    await page.keyboard.press('Shift+Space');

    const droppedPawn = page.locator('#board #piece-pawn');
    const droppedDie = page.locator('#board #piece-die');
    await expect(droppedPawn).toBeAttached();
    await expect(droppedDie).toBeAttached();

    const pawnPos = await droppedPawn.evaluate((el: HTMLElement) => ({
      left: el.style.left,
      position: el.style.position,
      top: el.style.top,
    }));
    const diePos = await droppedDie.evaluate((el: HTMLElement) => ({
      left: el.style.left,
      position: el.style.position,
      top: el.style.top,
    }));

    expect(pawnPos.left).toBe('226px');
    expect(pawnPos.top).toBe('126px');
    expect(diePos.left).toBe('226px');
    expect(diePos.top).toBe('126px');
  });
});
