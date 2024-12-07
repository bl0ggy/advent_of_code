#!/bin/bash

if [ $# -ne 2 ]; then
    echo "Usage: ./download_inputs.sh session-id year"
fi

sessionId=$1
year=$2
loop=0

for i in $(seq 1 25);
do
    [[ i -lt 10 ]] && day="0$i" || day="$i"
    filename="$year/day$day""_input.txt"
    if [ -f "$filename" ]; then
        echo "$filename exists"
    else
        echo "$filename downloading"
        userAgent="https://github.com/bl0ggy by $EMAIL" # User argent request by https://www.reddit.com/r/adventofcode/wiki/faqs/automation/
        address="https://adventofcode.com/$year/day/$i/input"
        # address="https://httpbin.io/user-agent"
        statusCode=$(curl -A "$userAgent" -I "$address" -H "Cookie: session=$sessionId" 2>/dev/null | head -n 1 | cut -d$' ' -f2)
        if [ $statusCode -eq "200" ]; then
            if [ $loop -ge 1 ]; then
                echo "Waiting 900s"
                sleep 900 # Throttle requested by https://www.reddit.com/r/adventofcode/wiki/faqs/automation/
            fi
            loop=$((loop+1))
            curl -A "$userAgent" "$address" -H "Cookie: session=$sessionId" > $filename
        else
            echo "Input page not accessible"
            break
        fi
    fi
done
