class Category:
    curr_max_display_order = 0
    def __init__(self, name, visible = False, display_order = 0):
        self.name = name
        self.visible = visible
        if (display_order == 0):
            Category.curr_max_display_order += 1
            self.display_order = Category.curr_max_display_order
        else:
            self.display_order = display_order
            if (display_order > Category.curr_max_display_order): 
                Category.curr_max_display_order = display_order
    
