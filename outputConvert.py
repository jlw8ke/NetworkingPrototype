#!/usr/bin/python

import re
import cgi
import datetime

reComr = re.compile(r'^committer')
reMess = re.compile(r'^    ')
reComm = re.compile(r'^commit ')

html_escape_table = {
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
        ">": "&gt;",
        "<": "&lt;",
}

def html_escape(text):
    """Produce entities within text."""
    htmlEscaped = cgi.escape(text)
    return "".join(html_escape_table.get(c,c) for c in htmlEscaped)

def main():
    f = open('changelog.xml', 'r+')
    printable = f.readlines()
    printablepared = []
    for x in printable:
        if reComr.match(x) == None and reMess.match(x) == None and reComm.match(x) == None:
            pass
        else:
            printablepared.append(x)
    printableParsed = ['<h2>Release Notes</h2><br /><br />']
    for x in printablepared:
        if reComr.match(x) != None:
            tempArray = x.split(' ')
            printableParsed.insert(-1, datetime.datetime.fromtimestamp(float(tempArray[-2])).strftime('%m/%d/%y') + ' - ')
        if reMess.match(x) != None:
            printableParsed.insert(-1, html_escape(x) + '  (')
        if reComm.match(x) != None:
            printableParsed.append(html_escape(x[:14]) + ' ) <br /><br />')
 
    for x in printableParsed:
        print x




if __name__ == '__main__': 
    main()

