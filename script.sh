#!/bin/bash
counter = 1

while [[ $counter -le 135 ]]
do
  echo "fetching hero: $counter"
  curl "https://www.dota2.com/datafeed/herodata?language=spanish&hero_id=$counter" > ./heroes/$counter.json
  counter=$(($counter+1))
done