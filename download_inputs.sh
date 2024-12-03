#!/bin/bash

if [ $# -ne 2 ]; then
    echo "Usage: ./download_inputs.sh session-id year"
fi

sessionId=$1
year=$2

for i in $(seq 1 25);
do
    [[ i -lt 10 ]] && day="0$i" || day="$i"
    filename="$year/day$day""_input.txt"
    if [ -f "$filename" ]; then
        echo "$filename exists"
    else
        echo "$filename downloading"
        statusCode=$(curl -I "https://adventofcode.com/$year/day/$i/input" -H "Cookie: session=$sessionId" 2>/dev/null | head -n 1 | cut -d$' ' -f2)
        if [ $statusCode -eq "200" ]; then
            curl "https://adventofcode.com/$year/day/$i/input" -H "Cookie: session=$sessionId" > $filename
        else
            echo "Input page not accessible"
            break
        fi
    fi
done
