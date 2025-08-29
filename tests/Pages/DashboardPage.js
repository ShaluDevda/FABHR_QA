// pages/DashboardPage.js
class DashboardPage {
    constructor(page) {
      this.page = page;
      this.birthdayCounter = page.locator("//div[@data-target='#birthday']//span[@class='birtday-text-cont'][normalize-space()='0']");
      this.announcementSection = page.locator("//h3[normalize-space()='Announcements']");
      this.quickActionBtn = page.locator("//a[normalize-space()='Quick Action']");
    }
  
   
  
    async validateCountersVisible() {
      await this.birthdayCounter.toContainText("Announcements");
  
    await expect(this.birthdayCounter).toBeVisible();
    }
  
    async openQuickAction() {
      await this.quickActionBtn.click();
    }
  }
  
  module.exports = { DashboardPage };
  