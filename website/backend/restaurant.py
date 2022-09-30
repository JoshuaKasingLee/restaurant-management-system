from init_db import query_db
from manager import Manager
from wait_staff import WaitStaff
from kitchen_staff import KitchenStaff
from table import Table
class Restaurant:
    def __init__(self, name):
        self.name = name
        self.tables = []
        self.menu = []
        self.leaderboard = []
        self.manager = None
        self.wait = None
        self.kitchen = None
        #may need token thingy for customer and everyone not sure
        
    def populate(self):
        #make for each entry in db, menu items, tables, leaderboard entries, manager, waiter, kitchen
        result = query_db("select password from staff where role = 'manager'");
        m_pw = result[0][0]
        new_m = Manager(m_pw, self);
        self.manager = new_m;
        
        result = query_db("select password from staff where role = 'wait'");
        w_pw = result[0][0]
        new_w = WaitStaff(w_pw, self);
        self.wait = new_w;
        
        result = query_db("select password from staff where role = 'kitchen'");
        k_pw = result[0][0]
        new_k = KitchenStaff(k_pw, self);
        self.kitchen = new_k;
        
        result = query_db("select num, budget from tables");
        for tab in result:
            self.tables.append(Table(tab[0], tab[1]))
            
        
        
        
        
        

        