# docker build -t ericbutera/geo-fetcher .
# docker push ericbutera/geo-fetcher
FROM alpine/curl
ADD ./fetch.sh ./
ENTRYPOINT [ "/bin/sh", "./fetch.sh" ]