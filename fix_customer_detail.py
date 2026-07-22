import os

path = "e:/KARTIK/PROJECTS/Fundsroom/frontend/src/pages/CustomerDetail.jsx"
content = open(path, "r", encoding="utf-8").read()

# Fix: Remove duplicate extra closing div that's causing issues
# The page-header should have ONE closing div
content = content.replace(
    '        </div>\n      </div>\n      </div>\n      {message &&',
    '        </div>\n      </div>\n      {message &&'
)

# Fix: info-cards missing closing
content = content.replace(
    '          </form>\n</div>\n      <div className="followup-section">',
    '          </form>\n        </div>\n      </div>\n      <div className="followup-section">'
)

open(path, "w", encoding="utf-8").write(content)
print("Fixed successfully")
