import sys
import pandas as pd
# import openpyxl
def func():
    dfX=pd.read_excel('aa.xlsx')
    dfX.to_csv('aa.xlsx',index=False,header=False)
    df=pd.read_csv('aa.csv')
    df.drop(['Sr.','Links','Volume'],axis=1,inplace=True)
    df.rename(columns = {'% Chg': 'perChange', 'Symbol': 'nse','Price':'cmp','Stock Name':'Name'}, inplace = True)
    df.to_csv('aa.csv',index=False)
    print('done successfully')
    
func() 