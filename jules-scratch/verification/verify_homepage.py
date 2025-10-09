import re
from playwright.sync_api import sync_playwright, Page, expect

def verify_homepage(page: Page):
    """
    Verifies that the homepage loads correctly, displays the main heading,
    and takes a screenshot for visual confirmation.
    """
    # 1. Arrange: Go to the application's homepage.
    # The default port for react-scripts is 3000.
    page.goto("http://localhost:3000")

    # 2. Assert: Check for the main heading to ensure the page has loaded.
    # Using a robust, user-facing locator with a regular expression.
    heading = page.get_by_role("heading", name=re.compile(r"BIENVENIDO A ENERGY", re.IGNORECASE))
    expect(heading).to_be_visible(timeout=10000) # Wait up to 10 seconds

    # 3. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/verification.png")

# Boilerplate to run the verification
if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify_homepage(page)
        browser.close()