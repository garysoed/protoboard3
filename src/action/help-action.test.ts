import {expect, Page, test} from '@playwright/test';

async function setupPage(page: Page, bodyContent: string): Promise<void> {
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body>
        ${bodyContent}
      </body>
    </html>
  `);
  await page.addScriptTag({path: 'dist/testing.min.js'});
  await page.evaluate(() => {
    window.Protoboard.initialize();

    class TestPiece extends window.Protoboard.BasePiece {
      readonly sides = 1;

      constructor() {
        super('Test Piece', () => [new window.Protoboard.HelpAction()]);
      }
    }

    customElements.define('pb-test-piece', TestPiece);
  });
}

test.describe('HelpAction', () => {
  test('dispatches QueryActionsEvent when triggered by keypress', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <pb-test-piece id="piece">
        <pb-test-face slot="face0" text="Card"></pb-test-face>
      </pb-test-piece>
    `,
    );

    const received = await page.evaluate(() => {
      return new Promise<{targetId: string; type: string}>((resolve) => {
        document.addEventListener(
          window.Protoboard.QueryActionsEvent.TYPE,
          (e) => {
            const event = e as CustomEvent<{targetElement: Element}>;
            resolve({
              targetId: event.detail.targetElement.id,
              type: event.type,
            });
          },
          {once: true},
        );

        const piece = document.querySelector('#piece');
        piece?.dispatchEvent(
          new window.Protoboard.ActionEvent(
            '?',
            new KeyboardEvent('keydown', {key: '?'}),
            {x: 0, y: 0},
          ),
        );
      });
    });

    expect(received.type).toBe('pb-query-actions');
    expect(received.targetId).toBe('piece');
  });
});
